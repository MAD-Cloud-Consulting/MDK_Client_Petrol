import libCom from '../Common/Library/CommonLibrary';
import {GlobalVar} from '../Common/Library/GlobalCommon';
import libThis from './SupervisorLibrary';
import libMobile from '../MobileStatus/MobileStatusLibrary';
import {PartnerFunction} from '../Common/Library/PartnerFunction';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

/* 
* Contains all of the Supervisor Feature related functions
*/
export default class {

    /**
     * Is the Supervisor feature enabled in the backend? 
     * @param {*} context 
     */
    static isSupervisorFeatureEnabled(context) {
        return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Supervisor.global').getValue());
    }

     /**
     * Can the supervisor add time when approving something?
     * @param {*} context 
     */
    static isSupervisorTimeEnabled(context) {
        if (libThis.isSupervisorFeatureEnabled(context)) {
            let enabled = libCom.getAppParam(context, 'SUPERVISOR', 'PromptForTime');
            return (enabled === 'Y');
        }
        return false;
    }

    /**
     * Can the supervisor add signature when approving something?
     * @param {*} context 
     */
    static isSupervisorSignatureEnabled(context) {
        if (libThis.isSupervisorFeatureEnabled(context)) {
            let enabled = libCom.getAppParam(context, 'SUPERVISOR', 'PromptForSignature');
            return (enabled === 'Y');
        }
        return false;
    }

    /**
     * Obtain the Users Organization ID.
     * @param {*} context
     */
    static getUserOrgId(context) {
        let user = GlobalVar.getUserSystemInfo().get('PERNO');
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserRoles', ['OrgId'], "$filter=PersonnelNo eq '" + user + "'").then(function(results) {
            if (results && results.length > 0) {
                let row = results.getItem(0);
                return row.OrgId;
            }
            return '';
        });
    }

    /**
     * Read the user record and compare role with target
     * @param {*} context 
     */
    static checkUserRole(context, role) {
        if (libThis.isSupervisorFeatureEnabled(context)) {
            let user = GlobalVar.getUserSystemInfo().get('PERNO');
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserRoles', ['Role'], "$filter=PersonnelNo eq '" + user + "'").then(function(results) {
                if (results && results.length > 0) {
                    let row = results.getItem(0);
                    if (row.Role === role) {
                        return true;
                    }
                }
                return false;
            });
        }
        return Promise.resolve(false);
    }

    /**
     * Is the current user a supervisor?
     * @param {*} context 
     */
    static isUserSupervisor(context) {
        if (libThis.isSupervisorFeatureEnabled(context)) {
            let authorizationParam = libThis.getSupervisorAuthorization(context);
            if (authorizationParam === 'Y') { //Supervisor
                return Promise.resolve(true);
            } else if (authorizationParam === 'N') { //Technician
                return Promise.resolve(false);
            }
            return libThis.checkUserRole(context, 'S').then(result => { //Authorization not set, so check table
                return result;
            });
        }
        return Promise.resolve(false);
    }

    /**
     * Is the current user a technician?
     * @param {*} context 
     */
    static isUserTechnician(context) {
        if (libThis.isSupervisorFeatureEnabled(context)) {
            let authorizationParam = libThis.getSupervisorAuthorization(context);
            if (authorizationParam === 'N') { //Technician
                return Promise.resolve(true);
            } else if (authorizationParam === 'Y') { //Supervisor
                return Promise.resolve(false);
            }
            return libThis.checkUserRole(context, 'T').then(result => { //Authorization not set, so check table
                return result;
            });
        }
        return Promise.resolve(false); //Feature not enabled
    }

    /**
     * Customer could be using parameter based supervisor assignment.
     * This will be set to "Y" is current user is supervisor, "N" if technician, or empty if using UserRoles entity to determine current user role
     * @param {*} context 
     */
    static getSupervisorAuthorization(context) {
        return libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'SupervisorRole'); 
    }

    /**
     * If supervisor feature is enabled and this user is a technician and assignment type is work center:
     * User should not be able to interact with work orders and operations that are not assigned to them
     * @param {*} context 
     */
    static isBusinessObjectEditable(context) {
        if (libThis.isSupervisorFeatureEnabled(context)) {
            return libThis.isUserTechnician(context).then(tech => {
                if (tech) {
                    let assignmentType = libCom.getWorkOrderAssignmentType(context);
                    let binding = context.binding;
                    let person = GlobalVar.getUserSystemInfo().get('PERNO');
                    let type = binding['@odata.type'];
                    let pageName = context.getPageProxy().currentPage._definition.name;

                    if (assignmentType === '8' && type === '#sap_mobile.MyWorkOrderHeader') { //Work order work center
                        let assign = libCom.getStateVariable(context, 'ASSIGNED-' + binding.OrderId, pageName);
                        if (assign) { //Query below has already been run previously on this page, so no need to run again
                            if (assign === 'Y') {
                                return Promise.resolve(true);
                            }
                            return Promise.resolve(false);
                        }
                        if (binding.OrderId) {
                            let partnerTarget = PartnerFunction.getPersonnelPartnerFunction();
                            let filter = "$filter=OrderId eq '" + binding.OrderId + "' and PartnerFunction eq '" + partnerTarget + "'";
                            return libCom.getEntitySetCount(context, 'MyWorkOrderPartners', filter).then((count) => {
                                if (count === 0) { //No assignment records
                                    libCom.setStateVariable(context, 'ASSIGNED-' + binding.OrderId, 'Y', pageName);
                                    return Promise.resolve(true); //Tech allowed to work with unassigned orders
                                }
                                let filter2 = "$top=1&$filter=OrderId eq '" + binding.OrderId + "' and PartnerFunction eq '" + partnerTarget + "' and PersonnelNum eq '" + person + "'";
                                return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderPartners', ['OrderId'], filter2).then(function(results) {
                                    if (results && results.length > 0) { //Assignment matches current user
                                        libCom.setStateVariable(context, 'ASSIGNED-' + binding.OrderId, 'Y', pageName);
                                        return Promise.resolve(true);
                                    }
                                    libCom.setStateVariable(context, 'ASSIGNED-' + binding.OrderId, 'N', pageName);
                                    return Promise.resolve(false); //This order is not assigned to current user
                                });
                            });
                        }
                    } else if (assignmentType === '6' && type === '#sap_mobile.MyWorkOrderOperation') { //Operation work center
                        if (binding.PersonNum === person || binding.PersonNum === '00000000') {
                            return Promise.resolve(true); //Assignment matches current user, or no assignment
                        }
                        return Promise.resolve(false); //This operation is not assigned to current user
                    }
                }
                return Promise.resolve(true); //Not a technician or not a work center assignment
            });
        }
        return Promise.resolve(true); //Feature not enabled
    }

     /**
      * Is the current user a technician, and does the current business object (work order or operation) require review by supervisor?
      * @param {*} context 
      * @param {*} businessObject - Either a work order, operation or sub-operation
      * @param {*} checkSubOperation - Do we want to check the sub-operation's parent, or ignore this sub-operation?
      */
    static checkReviewRequired(context, businessObject, checkSubOperation=false) {
        if (libThis.isSupervisorFeatureEnabled(context)) {
            return libThis.isUserTechnician(context).then(tech => {
                if (tech) {
                    let order, activity;
                    if (businessObject && businessObject['@odata.type']) {
                        if (businessObject['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
                            order = businessObject.OrderType;
                            activity = businessObject.MaintenanceActivityType;
                        } else if (businessObject['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
                            order = businessObject.WOHeader.OrderType;
                            activity = businessObject.WOHeader.MaintenanceActivityType;
                        } else if (checkSubOperation && businessObject['@odata.type'] === '#sap_mobile.MyWorkOrderSubOperation') {
                            order = businessObject.WorkOrderOperation.WOHeader.OrderType;
                            activity = businessObject.WorkOrderOperation.WOHeader.MaintenanceActivityType;
                        } else if (businessObject['@odata.type'] === '#sap_mobile.Confirmation') {
                            order = businessObject.WorkOrderHeader.OrderType;
                            activity = businessObject.WorkOrderHeader.MaintenanceActivityType;
                        }
                    }
                    if (order) {
                        let filter = "$filter=(OrderType eq '" + order + "' and ActivityType eq '')"; //Order by itself
                        if (activity) {
                            filter += " or (OrderType eq '" + order + "' and ActivityType eq '" + activity + "')"; //Order and activity
                            filter += " or (OrderType eq '' and ActivityType eq '" + activity + "')"; //Activity by itself
                        }
                        return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderActivityTypes', [], filter).then(function(results) {
                            if (results && results.length > 0) {
                                return true;
                            }
                            return false;
                        });
                    }
                }
                return false; //Not a technician user, or invaid business object
            });
        }
        return Promise.resolve(false);  //Feature not enabled
    }

    /**
     * Should a blank confirmation be created during complete/confirm for this business object?
     * For operations and work orders, we do not create a confirmation if review is required and assignment type matches that object
     * @param {*} context Work order, operation or sub-operation context
     */
    static decideCreateBlankConfirmation(context, instance) {
        let create = false;
        if (instance) {
            return libThis.checkReviewRequired(context, context.binding).then(review => {
                if (instance.name() === 'CompleteMobileStatusAction_WorkOrder') { //Create confirmation if review is not required
                    if (libMobile.isHeaderStatusChangeable(context) && !review) {
                        create = true;
                    }
                }
                if (instance.name() === 'CompleteMobileStatusAction_Operation') { //Create confirmation if review is not required, or assignment type is not operation (allows confirming operations)
                    if ((libMobile.isOperationStatusChangeable(context) && !review) || !libMobile.isOperationStatusChangeable(context)) {
                        create = true;
                    }
                }
                if (instance.name() === 'CompleteMobileStatusAction_SubOperation') { //Always create confirmation for sub-operations, since they never require review
                    create = true;
                }
                return Promise.resolve(create);
            });
        }
        return Promise.resolve(create);
    }

    /**
     * Work Center to use for assignments if SUPERVISOR.AssignmentModel = 'W' or empty
     * @param {*} context 
     */
    static getSupervisorWorkCenter() {
        return GlobalVar.getUserSystemInfo().get('USER_PARAM.VAP');  //Double check with backend.  Is this the correct value?
    }

    /**
     * OrgId to use for assignments if SUPERVISOR.AssignmentModel = 'O'
     * @param {*} context 
     */
    static getSupervisorOrgId() {
        return GlobalVar.getUserSystemInfo().get('USER_PARAM.\/MERP\/SUPVR_ORGID');
    }

    /**
     * Get the assignment model to use when supervisor is assigning work
     * W = work center, O = org id.  Default to W if not set
     * @param {*} context 
     */
    static getSupervisorAssignmentModel(context) {
        return libCom.getAppParam(context, 'SUPERVISOR', 'AssignmentModel');
    }
    
    /**
     * Title of the Review mobile status.
     * @param {*} context 
     */
    static reviewStatus(context) {
        return context.localizeText('REVIEW');
    }

     /**
     * Title of the Rejected mobile status.
     * @param {*} context 
     */
    static rejectedStatus(context) {
        return context.localizeText('REJECTED');
    }

    /**
     * Title of the Due Date label.
     * @param {*} context 
     */
    static dueDateLabel(context) {
        return context.localizeText('due_date');
    }

    /**
     * Title of the Supervisor section in the Overview page
     * if there are work orders to be reviewed.
     * @param {*} context 
     */
    static supervisorSectionTitleForPendingWOReviews(context) {
        return context.localizeText('work_orders_pending_review');
    }

    /**
     * Title of the Supervisor section in the Overview page
     * if there are operations to be reviewed.
     * @param {*} context 
     */
    static supervisorSectionTitleForPendingOperationReviews(context) {
        return context.localizeText('operations_pending_review');
    }

    /**
     * Title of the Supervisor section in the Overview page 
     * if there are NO pending work orders submitted by technicians.
     * @param {*} context 
     */
    static supervisorSectionTitleforNoWO(context) {
        return context.localizeText('no_pending_work_orders_available');
    }

    /**
     * Title of the Supervisor section in the Overview page 
     * if there are NO pending operations submitted by technicians.
     * @param {*} context 
     */
    static supervisorSectionTitleforNoOperations(context) {
        return context.localizeText('no_pending_operations_available');
    }

    /**
     * Title of the Technician section in the Overview page 
     * if submitted work orders exist.
     * @param {*} context 
     */
    static technicianSectionTitleforWorkOrders(context) {
        return context.localizeText('submitted_work_orders');
    }

    /**
     * Title of the Technician section in the Overview page 
     * if submitted operations exist.
     * @param {*} context 
     */
    static technicianSectionTitleforOperations(context) {
        return context.localizeText('submitted_operations');
    }

    /**
     * Title of the Technician section in the Overview page 
     * if there are NO submitted work orders from the Supervisor.
     * @param {*} context 
     */
    static technicianSectionTitleforNoWorkOrders(context) {
        return context.localizeText('no_submitted_work_orders_available');
    }

    /**
     * Title of the Technician section in the Overview page 
     * if there are NO submitted operations from the Supervisor.
     * @param {*} context 
     */
    static technicianSectionTitleforNoOperations(context) {
        return context.localizeText('no_submitted_operations_available');
    }

    /**
     * Count of the pending work orders for review  
     * by the Supervisor Role.
     * @param {*} context 
     */
    static pendingWOReviewCount(context) {
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', libThis.getFilterForWOPendingReview(context, false));
    }

    /**
     * Gets the query for review and rejected work orders
     */
    static getFilterForWOPendingReview(context, useDataQuery = true) {
        let review = 'REVIEW';
        let rejected = 'REJECTED';

        if (useDataQuery) {
            let queryBuilder = context.dataQueryBuilder();
            queryBuilder.select('CostCenter,WODocuments/DocumentID,ObjectKey,MaintenanceActivityType,OrderType,Priority,DueDate,HeaderEquipment,OrderDescription,OrderId,MainWorkCenter,MainWorkCenterPlant,PlanningPlant,OrderMobileStatus_Nav/MobileStatus,OrderMobileStatus_Nav/CreateUserGUID,WOPriority/PriorityDescription,MarkedJob/PreferenceValue');
            queryBuilder.expand('WODocuments,WODocuments/Document,OrderMobileStatus_Nav,Operations,Operations/SubOperations,WOPriority,MarkedJob,UserTimeEntry_Nav,WOPartners,WOPartners/Employee_Nav');
            queryBuilder.orderBy('Priority,DueDate,OrderId,WODocuments/DocumentID,OrderMobileStatus_Nav/MobileStatus');
            queryBuilder.filter("(OrderMobileStatus_Nav/MobileStatus eq '" + review + "' or OrderMobileStatus_Nav/MobileStatus eq '" + rejected + "')");
            return queryBuilder;
        }
        libCom.setStateVariable(context, 'CustomListFilter', "(OrderMobileStatus_Nav/MobileStatus eq '" + review + "' or OrderMobileStatus_Nav/MobileStatus eq '" + rejected + "')");
        return 'select=CostCenter,WODocuments/DocumentID,ObjectKey,MaintenanceActivityType,OrderType,Priority,DueDate,HeaderEquipment,OrderDescription,OrderId,MainWorkCenter,MainWorkCenterPlant,PlanningPlant,OrderMobileStatus_Nav/MobileStatus,OrderMobileStatus_Nav/CreateUserGUID,WOPriority/PriorityDescription,MarkedJob/PreferenceValue' +
        '&$expand=WODocuments,WODocuments/Document,OrderMobileStatus_Nav,Operations,Operations/SubOperations,WOPriority,MarkedJob,UserTimeEntry_Nav,WOPartners,WOPartners/Employee_Nav' +
        '&$orderby=Priority,DueDate,OrderId,WODocuments/DocumentID,OrderMobileStatus_Nav/MobileStatus' +
        "&$filter=(OrderMobileStatus_Nav/MobileStatus eq '" + review + "' or OrderMobileStatus_Nav/MobileStatus eq '" + rejected + "')";
    }

    /**
     * Count of the submitted operations 
     * by the Supervisor Role.
     * @param {*} context 
     */
    static pendingOperationsReviewCount(context) {
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', libThis.getFilterForOperationPendingReview(context, false));
    }

    /**
     * Gets the query for review and rejected operations
     */
    static getFilterForOperationPendingReview(context, useDataQuery = true) {
        let review = 'REVIEW';
        let rejected = 'REJECTED';

        if (useDataQuery) {
            let queryBuilder = context.dataQueryBuilder();
            queryBuilder.expand('WOObjectList_Nav,Tools,OperationMobileStatus_Nav,OperationLongText,WOHeader,UserTimeEntry_Nav,WOHeader/WOPriority,Employee_Nav');
            queryBuilder.orderBy('OrderId,OperationNo,OperationMobileStatus_Nav/MobileStatus');
            queryBuilder.filter("(OperationMobileStatus_Nav/MobileStatus eq '" + review + "' or OperationMobileStatus_Nav/MobileStatus eq '" + rejected + "')");
            return queryBuilder;
        }
        libCom.setStateVariable(context, 'CustomListFilter', "(OperationMobileStatus_Nav/MobileStatus eq '" + review + "' or OperationMobileStatus_Nav/MobileStatus eq '" + rejected + "')");
        return '$expand=WOObjectList_Nav,Tools,OperationMobileStatus_Nav,OperationLongText,WOHeader,UserTimeEntry_Nav,WOHeader/WOPriority,Employee_Nav' +
        '&$orderby=OrderId,OperationNo,OperationMobileStatus_Nav/MobileStatus' +
        "&$filter=(OperationMobileStatus_Nav/MobileStatus eq '" + review + "' or OperationMobileStatus_Nav/MobileStatus eq '" + rejected + "')";
    }
    
    /**
     * Count of the submitted work orders 
     * by the Technician Role.
     * @param {*} context 
     */
    static submittedWOCount(context) {
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', libThis.getFilterForSubmittedWO(context, false));
    }

    /**
     * Gets the filter for the query for High and Very High Workorders.
     */
    static getFilterForSubmittedWO(context, useDataQuery = true) {
        let review = 'REVIEW';
        let rejected = 'REJECTED';

        if (useDataQuery) {
            let queryBuilder = context.dataQueryBuilder();
            queryBuilder.select('CostCenter,WODocuments/DocumentID,ObjectKey,MaintenanceActivityType,OrderType,Priority,DueDate,HeaderEquipment,OrderDescription,OrderId,MainWorkCenter,MainWorkCenterPlant,PlanningPlant,OrderMobileStatus_Nav/MobileStatus,OrderMobileStatus_Nav/CreateUserGUID,WOPriority/PriorityDescription,MarkedJob/PreferenceValue');
            queryBuilder.expand('WODocuments,WODocuments/Document,OrderMobileStatus_Nav,Operations,Operations/SubOperations,WOPriority,MarkedJob,UserTimeEntry_Nav,WOPartners,WOPartners/Employee_Nav');
            queryBuilder.orderBy('Priority,DueDate,OrderId,WODocuments/DocumentID,OrderMobileStatus_Nav/MobileStatus');
            queryBuilder.filter("(OrderMobileStatus_Nav/MobileStatus eq '" + review + "' or OrderMobileStatus_Nav/MobileStatus eq '" + rejected + "')");
            return queryBuilder;
        }
        libCom.setStateVariable(context, 'CustomListFilter', "(OrderMobileStatus_Nav/MobileStatus eq '" + review + "' or OrderMobileStatus_Nav/MobileStatus eq '" + rejected + "')");
        return 'select=CostCenter,WODocuments/DocumentID,ObjectKey,MaintenanceActivityType,OrderType,Priority,DueDate,HeaderEquipment,OrderDescription,OrderId,MainWorkCenter,MainWorkCenterPlant,PlanningPlant,OrderMobileStatus_Nav/MobileStatus,OrderMobileStatus_Nav/CreateUserGUID,WOPriority/PriorityDescription,MarkedJob/PreferenceValue' +
        '&$expand=WODocuments,WODocuments/Document,OrderMobileStatus_Nav,Operations,Operations/SubOperations,WOPriority,MarkedJob,UserTimeEntry_Nav,WOPartners,WOPartners/Employee_Nav' +
        '&$orderby=Priority,DueDate,OrderId,WODocuments/DocumentID,OrderMobileStatus_Nav/MobileStatus' +
        "&$filter=(OrderMobileStatus_Nav/MobileStatus eq '" + review + "' or OrderMobileStatus_Nav/MobileStatus eq '" + rejected + "')";
    }

    /**
     * Count of the submitted operations 
     * by the Technician Role.
     * @param {*} context 
     */
    static submittedOperationCount(context) {
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', libThis.getFilterForSubmittedOperation(context, false));
    }

    /**
     * Gets the query for review and rejected operations
     */
    static getFilterForSubmittedOperation(context, useDataQuery = true) {
        let review = 'REVIEW';
        let rejected = 'REJECTED';

        if (useDataQuery) {
            let queryBuilder = context.dataQueryBuilder();
            queryBuilder.expand('WOObjectList_Nav,Tools,OperationMobileStatus_Nav,OperationLongText,WOHeader,UserTimeEntry_Nav,WOHeader/WOPriority,Employee_Nav');
            queryBuilder.orderBy('OrderId,OperationNo,OperationMobileStatus_Nav/MobileStatus');
            queryBuilder.filter("(OperationMobileStatus_Nav/MobileStatus eq '" + review + "' or OperationMobileStatus_Nav/MobileStatus eq '" + rejected + "')");
            return queryBuilder;
        }
        libCom.setStateVariable(context, 'CustomListFilter', "(OperationMobileStatus_Nav/MobileStatus eq '" + review + "' or OperationMobileStatus_Nav/MobileStatus eq '" + rejected + "')");
        return '$expand=WOObjectList_Nav,Tools,OperationMobileStatus_Nav,OperationLongText,WOHeader,UserTimeEntry_Nav,WOHeader/WOPriority,Employee_Nav' +
        '&$orderby=OrderId,OperationNo,OperationMobileStatus_Nav/MobileStatus' +
        "&$filter=(OperationMobileStatus_Nav/MobileStatus eq '" + review + "' or OperationMobileStatus_Nav/MobileStatus eq '" + rejected + "')";
    }

}
