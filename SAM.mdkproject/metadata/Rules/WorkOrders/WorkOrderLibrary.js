import libCommon from '../Common/Library/CommonLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import assnType from '../Common/Library/AssignmentType';
import ConstantsLibrary from '../Common/Library/ConstantsLibrary';
import libWoMobile from './MobileStatus/WorkOrderMobileStatusLibrary';
import libDoc from '../Documents/DocumentLibrary';
import libControlDescription from '../Common/Controls/DescriptionNoteControl';
import Logger from '../Log/Logger';
import { UserPreferenceLibrary as libUserPref } from '../UserPreferences/UserPreferencesLibrary';
//This reference to itself is necessary because promises lose context when running these functions,
//causing sub-rules to be unaccessable when using "this." syntax
import { WorkOrderLibrary as libWo, WorkOrderControlsLibrary as libWoControls, PrivateMethodsLibrary as libPrivate } from './WorkOrderLibrary';
import markedJobCreateUpdateOnCommit from '../MarkedJobs/MarkedJobCreateUpdateOnCommit';
import Stylizer from '../Common/Style/Stylizer';
import DocLib from '../Documents/DocumentLibrary';
import libClock from '../ClockInClockOut/ClockInClockOutLibrary';
import OperationMobileStatus from '../MobileStatus/OperationMobileStatus';
import libMobile from '../MobileStatus/MobileStatusLibrary';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import ODataDate from '../Common/Date/ODataDate';
import PersonaLibrary from '../Persona/PersonaLibrary';
import WorkOrdersFSMQueryOption from './ListView/WorkOrdersFSMQueryOption';
import ExecuteActionWithAutoSync from '../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';
import { PartnerFunction } from '../Common/Library/PartnerFunction';

/**
 * Contains all common Work Order related method, except CreateUpdate page event and contorl method;
 * NOTE: For CreateUpdate related Event and Control please use WorkOrderEventLibrary and WorkWorkControlsLibrary
 */
export class WorkOrderLibrary {

    /**
	 * Set FollowUpFlagPage variable
	 * @param {IPageProxy} context
	 */
    static setFollowUpFlagPage(context) {
        libCommon.setStateVariable(context, 'FollowUpFlagPage', context._page.id);
    }

    /**
	 * Get FollowUpFlagPage variable
	 * @param {IPageProxy} context
     * @return {string|undefined}
	 */
    static getFollowUpFlagPage(context) {
        return libCommon.getStateVariable(context, 'FollowUpFlagPage');
    }

    /**
	 * Remove FollowUpFlagPage variable
	 * @param {IPageProxy} context
	 */
    static removeFollowUpFlagPage(context) {
        libCommon.removeStateVariable(context, 'FollowUpFlagPage');
    }

    /**
	 * Set the ChangeSet flag
	 * @param {IPageProxy} context
	 * @param {boolean} FlagValue
	 */
    static setFollowUpFlag(context, FlagValue) {
        libCommon.setStateVariable(context, 'OnFollowUpWorkOrder', FlagValue, libWo.getFollowUpFlagPage(context));
    }

    /**
     * gets the 'OnFollowUpWorkOrder'
     *
     * @static
     * @param {IClientAPI} context
     * @return {boolean}
     *
     * @memberof WorkOrderLibrary
     */
    static getFollowUpFlag(context) {
        const page = libWo.getFollowUpFlagPage(context);

        if (!page) {
            return false;
        }

        let result = libCommon.getStateVariable(context, 'OnFollowUpWorkOrder', page);
        if (result) {
            return result;
        } else {
            return false;
        }
    }

    /**
	 * Set the FollowOn flag
	 * @param {IPageProxy} context
	 * @param {boolean} FlagValue
	 */
     static setFollowOnFlag(context, FlagValue) {
        libCommon.setStateVariable(context, 'OnFollowOnWorkOrder', FlagValue, libWo.getFollowUpFlagPage(context));
    }

    /**
     * gets the 'OnFollowOnWorkOrder'
     *
     * @static
     * @param {IClientAPI} context
     * @return {boolean}
     *
     * @memberof WorkOrderLibrary
     */
     static getFollowOnFlag(context) {
        const page = libWo.getFollowUpFlagPage(context);

        if (!page) {
            return false;
        }

        let result = libCommon.getStateVariable(context, 'OnFollowOnWorkOrder', page);
        if (result) {
            return result;
        } else {
            return false;
        }
    }

    /**
     * Gets the count of High and Very High Workorders
     */
    static highPriorityOrdersCount(sectionProxy) {
        return sectionProxy.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', libWo.getFilterForHighPriorityWorkorders(sectionProxy));
    }

    /**
     * Gets the count of work orders with exact status
     * @param {IClientAPI} sectionProxy
     * @param {string} status
     * @param {Date} date
     * @param {string} field
     * @return {number}
     */
    static statusOrdersCount(sectionProxy, status, date, field) {
        return this.statusOrdersFilter(sectionProxy, status, date, field).then(filter => {
            return sectionProxy.count(
                '/SAPAssetManager/Services/AssetManager.service',
                'MyWorkOrderHeaders',
                filter           
            );
        });
    }

    /**
     * Provides filter query for the service orders with exact status and date
     * @param {IClientAPI} sectionProxy
     * @param {string} status
     * @param {Date} date
     * @param {string} field
     * @return {string}
     */
    static statusOrdersFilter(sectionProxy, status, date, field) {
        return WorkOrdersFSMQueryOption(sectionProxy).then(types => {
            return this.dateOrdersFilter(sectionProxy, date, field).then(dateFilter => {
                let queryOption = `$filter=OrderMobileStatus_Nav/MobileStatus eq '${status}' and ${dateFilter}`;
            
                if (!libVal.evalIsEmpty(types)) {
                    queryOption += ' and ' + types;
                }
                
                return queryOption;
            });
            
        });
    }

     /**
     * Gets the actual date from ActualDate state variavle if it exists
     * @param {IClientAPI} sectionProxy
     * @return {Date}
     */
      static getActualDate(sectionProxy) {
        let date = libCommon.getStateVariable(sectionProxy, 'ActualDate');
        return date || new Date(new Date().setHours(0,0,0,0));
    }

    /**
     * Returns the filter values for actual date
     * @param {IClientAPI} sectionProxy
     * @param {Date} date
     * @param {string} field
     * @return {string}
     */
     static dateOperationsFilter(sectionProxy, date, field) {

        //There are a couple of reasons why the below code is needed. 
        //First, the backend provides the date and time in separate fields and there is no way to do a date comparison query by using both fields.
        //Second, the date and time provided by the backend is in the backend timezone so we need to convert that to the local timezone
        //So, first we will gather operations by using range of 1 day before and 1 day after the selected day so it covers all timezones 
        //Then, we will take the date and time of the order/operation and create a date object in the current timezone
        //Then, take this date and see if it falls into the selected day.
        const currentDate = new ODataDate(date);

        const oneDayBack = (new Date(date)).setDate(date.getDate() - 1);
        const startDate = new ODataDate(oneDayBack);

        const oneDayAhead = (new Date(date)).setDate(date.getDate()+1);
        const endDate = new ODataDate(oneDayAhead);
        
        let query = `$filter=${field} ge ${startDate.queryString(sectionProxy, 'date')} and ${field} le ${endDate.queryString(sectionProxy, 'date')}`;

        return sectionProxy.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', [], query).then(operations => {
            let todayOperations = [];
            
            if (operations.length > 0) {
                for (let i=0; i < operations.length; i++) {
                    let operationRecord = operations.getItem(i);
                    let operationStartDate = new ODataDate(operationRecord.SchedEarliestStartDate);

                    if (operationStartDate.date() >= currentDate.date() && operationStartDate.date() < endDate.date()) {
                        todayOperations.push(`(OrderId eq '${operationRecord.OrderId}' and OperationNo eq '${operationRecord.OperationNo}')`);
                    }
                }
            }

            return todayOperations.length > 0 ? `(${todayOperations.join(' or ')})` : false;
        });
    }

    /**
     * Returns the filter values for actual date
     * @param {IClientAPI} sectionProxy
     * @param {Date} date
     * @param {string} field
     * @return {string}
     */
     static dateOrdersFilter(sectionProxy, date, field) {

        //There are a couple of reasons why the below code is needed. 
        //First, the backend provides the date and time in separate fields and there is no way to do a date comparison query by using both fields.
        //Second, the date and time provided by the backend is in the backend timezone so we need to convert that to the local timezone
        //So, first we will gather operations by using range of 1 day before and 1 day after the selected day so it covers all timezones 
        //Then, we will take the date and time of the order/operation and create a date object in the current timezone
        //Then, take this date and see if it falls into the selected day.
        const currentDate = new ODataDate(date);

        const oneDayBack = (new Date(date)).setDate(date.getDate() - 1);
        const startDate = new ODataDate(oneDayBack);

        const oneDayAhead = (new Date(date)).setDate(date.getDate()+1);
        const endDate = new ODataDate(oneDayAhead);
        
        let query = `$filter=${field} ge ${startDate.queryString(sectionProxy, 'date')} and ${field} le ${endDate.queryString(sectionProxy, 'date')}`;

        return sectionProxy.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], query).then(orders => {
            let todayOrders = [];
            
            if (orders.length > 0) {
                for (let i=0; i < orders.length; i++) {
                    let orderRecord = orders.getItem(i);
                    let orderStartDate = new ODataDate(orderRecord.ScheduledStartDate);

                    if (orderStartDate.date() >= currentDate.date() && orderStartDate.date() < endDate.date()) {
                        todayOrders.push(`(OrderId eq '${orderRecord.OrderId}')`);
                    }
                }
            }

            return todayOrders.length > 0 ? `(${todayOrders.join(' or ')})` : false;

        });
    }

    

    /**
     * Gets the filter for the query for High and Very High Workorders.
     */
    static getFilterForHighPriorityWorkorders(context) {
        libCommon.setStateVariable(context, 'CustomListFilter', "(Priority eq '1' or  Priority eq '2')");
        return "$filter=(Priority eq '1' or  Priority eq '2')";
    }

    /**
     * Checks to see if the work order from context is marked or not.
     * @param {*} pageClientAPI
     * @return true if work order is marked.
     */
    static isMarkedWorkOrder(pageProxy) {
        let woId = libUserPref.getPreferenceName(pageProxy);
        woId = woId.replace(/'/g, "''");
        let queryoption = `$filter=PreferenceName eq '${woId}' and PreferenceGroup eq 'MARKED_JOBS' and PreferenceValue eq 'true'&$orderby=PreferenceName`;
        return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'UserPreferences', [], queryoption).then(markedJobs => {
            if (!libVal.evalIsEmpty(markedJobs)) {
                return true;
            } else {
                return false;
            }
        });
    }
    /**
    * Get Prioirty of the Work Order context
    * @param context
    * @return Priority Description if not null else empty space string
    */
    static getWorkOrderPriorityFormat(context) {
        let binding = context.getBindingObject();
        if (binding && binding.WOPriority && binding.WOPriority.PriorityDescription) {
            return binding.WOPriority.PriorityDescription;
        }
        return ' ';
    }

    /**
     * Gets the query options for work order list view.
     */
    static getWorkOrdersListViewQueryOptions(context) {
        let queryBuilder = context.dataQueryBuilder();
        queryBuilder.select('*,OrderMobileStatus_Nav/*,WODocuments/DocumentID,WOPartners/Employee_Nav/EmployeeName,WOPartners/PartnerFunction,MarkedJob/PreferenceValue,WOPriority/PriorityDescription,WOPriority/Priority');
        queryBuilder.expand('WODocuments,WODocuments/Document,OrderMobileStatus_Nav/OverallStatusCfg_Nav,Operations,Operations/SubOperations,WOPriority,MarkedJob,UserTimeEntry_Nav,WOPartners,WOPartners/Employee_Nav');
        queryBuilder.orderBy('Priority,DueDate,OrderId,WODocuments/DocumentID,OrderMobileStatus_Nav/MobileStatus');
        return queryBuilder;
    }

    /**
     * Gets the High and Very High Workorders for the List view.
     */
    static getHighPriorityWorkOrdersQueryOptions(context) {
        let queryBuilder = context.dataQueryBuilder();
        queryBuilder.select('WOPartners/PartnerFunction,WOPartners/Employee_Nav/EmployeeName,CostCenter,WODocuments/DocumentID,ObjectKey,MaintenanceActivityType,OrderType,Priority,DueDate,HeaderEquipment,OrderDescription,OrderId,MainWorkCenter,MainWorkCenterPlant,PlanningPlant,OrderMobileStatus_Nav/MobileStatus,OrderMobileStatus_Nav/CreateUserGUID,WOPriority/PriorityDescription,MarkedJob/PreferenceValue,ObjectNumber');
        queryBuilder.filter("(Priority eq '1' or  Priority eq '2')");
        queryBuilder.expand('WODocuments,WODocuments/Document,OrderMobileStatus_Nav,Operations,Operations/SubOperations,WOPriority,MarkedJob,WOGeometries,WOGeometries/Geometry,HeaderLongText,UserTimeEntry_Nav,WOPartners,WOPartners/Employee_Nav');
        queryBuilder.orderBy('Priority,DueDate,OrderId');
        return queryBuilder;
    }

    static getWorkOrderDetailsNavQueryOption(context) {
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue())) {
            return '$select=*,WOPartners/PartnerFunction,FunctionalLocation/FuncLocDesc,OrderMobileStatus_Nav/*&$expand=WODocuments,OrderMobileStatus_Nav,FunctionalLocation,Operations,Operations/SubOperations,WOGeometries/Geometry,MarkedJob,Confirmations,UserTimeEntry_Nav,WOObjectList_Nav,WOPartners/Address_Nav/AddressGeocode_Nav/Geometry_Nav,Address/AddressGeocode_Nav/Geometry_Nav,Equipment/Address/AddressGeocode_Nav/Geometry_Nav,EAMChecklist_Nav';
        } else {
            return '$select=*,WOPartners/PartnerFunction,FunctionalLocation/FuncLocDesc,OrderMobileStatus_Nav/*&$expand=WODocuments,OrderMobileStatus_Nav,FunctionalLocation,Operations,Operations/SubOperations,WOGeometries/Geometry,MarkedJob,Confirmations,UserTimeEntry_Nav,WOObjectList_Nav,WOPartners/Address_Nav/AddressGeocode_Nav/Geometry_Nav,Address/AddressGeocode_Nav/Geometry_Nav,Equipment/Address/AddressGeocode_Nav/Geometry_Nav';
        }
    }

    /**
     * Gets the query option filter used to get all the marked jobs from UserPreferences EntitySet
     */
    static getMarkedJobsQueryOptionsFilter() {
        return "$filter=(PreferenceGroup eq 'MARKED_JOBS' and PreferenceValue eq 'true')&$orderby=PreferenceName";
    }

    /**
     * Query option filter used to retrieve all reminders from UserPreferences EntitySet.
     */
    static getRemindersQueryOptionsFilter() {
        return "$filter=(PreferenceGroup eq 'REMINDERS')&$orderby=PreferenceName";
    }

    /**
     * Gets all the UserPreferences properties for a given Job.
     * @param pageClientAPI Page Client API
     * @param orderId ID of the Job for which you want to get the UserPreferences info.
     * @return Promise that holds the results in an array.
     */
    static getUserPreferences(pageClientAPI, orderId) {
        var queryOptions = '$orderby=PreferenceName';
        if (!libVal.evalIsEmpty(orderId)) {
            queryOptions += "&$filter=(PreferenceName eq '" + orderId + "')";
        }
        return pageClientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'UserPreferences', [], queryOptions);
    }

    /**
     * Gets the query option filter used to get all the Follow On Work Orders for a base order
     */
    static WorkOrdersDetailsFollowOnQueryOption(context) {
        let queryBuilder = this.getWorkOrdersListViewQueryOptions(context);
        if (!libVal.evalIsEmpty(context.binding) && context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
            let reference = context.binding.OrderId;
            queryBuilder.filter(`ReferenceOrder eq '${reference}'`);
            return queryBuilder;
        } else {
            return queryBuilder;
        }
    }
    
    /**
     * Gets a particular UserPreferences property for a given Job.
     * @param pageClientAPI Page Client API
     * @param orderId ID of the Job for which you want to get the UserPreferences property.
     * @param propertyName Name of the UserPreferences property you are looking for.
     * @return Value of the UserPreferences property for a given Job or blank if not found.
     */
    static getUserPreferencesProperty(pageClientAPI, orderId, propertyName) {
        var propertyValue = '';
        if (libVal.evalIsEmpty(orderId)) {
            return propertyValue;
        }
        return libWo.getUserPreferences(pageClientAPI, orderId).then(userPreferences => {
            if (userPreferences.length > 0) {
                propertyValue = userPreferences.getItem(0)[propertyName];
            }
            if (libVal.evalIsEmpty(propertyValue)) {
                return '';
            } else {
                return propertyValue;
            }
        });
    }

    /**
     * Dynamically set the CreateLinks of the WorkOrder
     * @param {IPageProxy}
     */
    static getCreateUpdateLinks(pageProxy) {
        var links = [];
        let onCreate = libCommon.IsOnCreate(pageProxy);

        //check Equipment ListPicker, if value is set, add Equipment link
        let equipment = libWoControls.getEquipment(pageProxy);
        if (equipment && equipment !== '' && !libCommon.isCurrentReadLinkLocal(equipment)) {
            let equipmentLink = pageProxy.createLinkSpecifierProxy(
                'Equipment',
                'MyEquipments',
                `$filter=EquipId eq '${equipment}'`
            );
            links.push(equipmentLink.getSpecifier());
        }

        //check Functional Location ListPicker, if value is set, add Func Loc link
        let funcLoc = libWoControls.getFunctionalLocation(pageProxy);
        if (funcLoc && funcLoc !== '' && !libCommon.isCurrentReadLinkLocal(funcLoc)) {
            funcLoc = decodeURIComponent(funcLoc); //ICMTANGOAMF10-16403 - bug fix
            let funcLocLink = pageProxy.createLinkSpecifierProxy(
                'FunctionalLocation',
                'MyFunctionalLocations',
                `$filter=FuncLocIdIntern eq '${funcLoc}'`
            );
            links.push(funcLocLink.getSpecifier());
        }

        //update notification link if coming from Notification details
        if (pageProxy.binding.FromNotification) {
            let notificationLink = pageProxy.createLinkSpecifierProxy(
                'Notification',
                'MyNotificationHeaders',
                `$filter=NotificationNumber eq '${pageProxy.binding.NotificationNumber}'`
            );
            links.push(notificationLink.getSpecifier());
        }

        //update Priority PrioritySeg link
        let priority = libWoControls.getPriority(pageProxy);
        let planningPlant = libWoControls.getPlanningPlant(pageProxy);
        let orderType = libWoControls.getOrderType(pageProxy);
        if (onCreate) {
            let linkPromises = [];
            linkPromises.push(
                pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', ['PriorityType'], `$filter=PlanningPlant eq '${planningPlant}' and OrderType eq '${orderType}'`).then(orderTypes => {
                    if (orderTypes.getItem(0)) {
                        let priorityType = orderTypes.getItem(0).PriorityType;
                        if (!libVal.evalIsEmpty(priority) && !libVal.evalIsEmpty(priorityType)) {
                            let priorityLink = pageProxy.createLinkSpecifierProxy(
                                'WOPriority',
                                'Priorities',
                                `$filter=PriorityType eq '${priorityType}' and Priority eq '${priority}'`
                            );
                            links.push(priorityLink.getSpecifier());
                        }
                    }
                    return links;
                })
            );
            if (equipment && equipment !== '' && libCommon.isCurrentReadLinkLocal(equipment)) {
                linkPromises.push(
                    libCommon.getEntityProperty(pageProxy, `MyEquipments(${equipment})`, 'EquipId').then(equipmentId => {
                        let equipmentLink = pageProxy.createLinkSpecifierProxy(
                            'Equipment',
                            'MyEquipments',
                            `$filter=EquipId eq '${equipmentId}'`
                        );
                        links.push(equipmentLink.getSpecifier());
                        return links;
                    })
                );
            }
            if (funcLoc && funcLoc !== '' && libCommon.isCurrentReadLinkLocal(funcLoc)) {
                linkPromises.push(
                    libCommon.getEntityProperty(pageProxy, `MyFunctionalLocations(${funcLoc})`, 'FuncLocIdIntern').then(funcLocId => {
                        let flocLink = pageProxy.createLinkSpecifierProxy(
                            'FunctionalLocation',
                            'MyFunctionalLocations',
                            `$filter=FuncLocIdIntern eq '${funcLocId}'`
                        );
                        links.push(flocLink.getSpecifier());
                        return links;
                    })
                );
            }
            return Promise.all(linkPromises).then(() => {
                return links;
            });
        } else {
            let priorityType = pageProxy.getBindingObject().PriorityType;
            if (!libVal.evalIsEmpty(priority)) {
                let priorityLink = pageProxy.createLinkSpecifierProxy(
                    'WOPriority',
                    'Priorities',
                    `$filter=PriorityType eq '${priorityType}' and Priority eq '${priority}'`
                );
                links.push(priorityLink.getSpecifier());
            }

            return Promise.resolve(links);
        }
    }

    /**
     * Dynamically set the DeleteLinks of WorkOrders
     */
    static getDeleteLinks(context) {
        let links = [];

        //check Equipment ListPicker, if not set and there is already a equipment. Remove it
        let equipment = libWoControls.getEquipment(context);
        if (!equipment && context.binding.Equipment) {
            let equipmentLink = context.createLinkSpecifierProxy(
                'Equipment',
                'MyEquipments',
                '',
                context.binding.Equipment['@odata.readLink']
            );
            links.push(equipmentLink.getSpecifier());
        }

        //check Functional Location ListPicker, if not set and there is already a functional loc. Remove it
        let funcLoc = libWoControls.getFunctionalLocation(context);
        if (!funcLoc && context.binding.FunctionalLocation) {
            let funcLocLink = context.createLinkSpecifierProxy(
                'FunctionalLocation',
                'MyFunctionalLocations',
                '',
                context.binding.FunctionalLocation['@odata.readLink']
            );
            links.push(funcLocLink.getSpecifier());
        }

        return links;
    }

    /**
     * Equipment or functional location changed, so set the work center plant and main work center from the technical object, or back to default
     * @param {*} context
     * @param {*} workCenterRow
     */
    static reloadWorkCenterPlant(context, workCenterRow) {

        let defaultWorkCenterPlant = assnType.getWorkOrderAssignmentDefaults().WorkCenterPlant.default;
        let defaultMainWorkCenter = assnType.getWorkOrderAssignmentDefaults().MainWorkCenter.default;
        let workCenterPlantLstPkrControl = context.evaluateTargetPath('#Control:WorkCenterPlantLstPkr');
        let mainWorkCenterLstPkrControl = context.evaluateTargetPath('#Control:MainWorkCenterLstPkr');
        let workCenterPlantSelected = libCommon.getListPickerValue(context.getControls()[0].getControl('WorkCenterPlantLstPkr').getValue());
        let mainWorkCenterSelected = libCommon.getListPickerValue(context.getControls()[0].getControl('MainWorkCenterLstPkr').getValue());

        if (workCenterRow) { //Use the plant and work center from the technical object
            defaultWorkCenterPlant = workCenterRow.PlantId;
            defaultMainWorkCenter = workCenterRow.ExternalWorkCenterId;
        }
        if (defaultWorkCenterPlant !== workCenterPlantSelected) {
            workCenterPlantLstPkrControl.setValue(defaultWorkCenterPlant);
            libCommon.setStateVariable(context, 'ResetWorkCenter', defaultMainWorkCenter);
            libCommon.setStateVariable(context, 'ResetWorkCenterPlant', defaultWorkCenterPlant);
            return libWoControls.updateMainWorkCenter(context);
        } else if (defaultMainWorkCenter !== mainWorkCenterSelected) {
            mainWorkCenterLstPkrControl.setValue(defaultMainWorkCenter);
        }
        return Promise.resolve(true);
    }

    /**
     * Reset the planning plant list picker (from equipment or func loc or user default)
     * Also reset the work center plant
     * @param {*} context
     * @param {*} planningControl
     * @param {*} plant
     * @param {*} workCenterRow
     */
    static reloadPlanningPlant(context, planningControl, plant, workCenterRow) {
        if (plant) { ///Reset the planning plant and order types
            planningControl.setValue(plant);
            libCommon.setStateVariable(context, 'TypePlanningPlant', plant);
            return libWoControls.updateOrderType(context).then(() => {
                return libWo.reloadWorkCenterPlant(context, workCenterRow);
            });
        } else {
            return libWo.reloadWorkCenterPlant(context, workCenterRow);
        }
    }

    /**
     * Checks if binding object is a service order or a work order.
     * @param {*} context 
     * @returns true if binding object is a service order.
     */
    static isServiceOrder(context) {
        let binding = context.getPageProxy().binding;
        if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
            binding = context.getPageProxy().binding.WOHeader;
        }
        if (binding['@odata.type'] !== '#sap_mobile.MyWorkOrderHeader') {
            binding = context.getPageProxy().binding;
        }
        if (libCommon.isDefined(binding.isServiceOrder)) {
            return Promise.resolve(binding.isServiceOrder);
        }
        let orderType = binding.OrderType;
        let planningPlant = binding.PlanningPlant; 

        if (!libCommon.isDefined(orderType) || !libCommon.isDefined(planningPlant)) {
            return Promise.resolve(false);
        }

        return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], `$filter=PlanningPlant eq '${planningPlant}' and OrderType eq '${orderType}'`).then((result) => {
            if (result.length > 0 && result.getItem(0).ServiceType === 'X') {
                binding.isServiceOrder = true;
            } else {
                binding.isServiceOrder = false;
            }
            return binding.isServiceOrder;
        }).catch((error) => {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(),`isServiceOrder(context) error: ${error}`);
            return false;
        });
    }

    /**
     * Checks if order being created is a service order.
     * @param {*} context 
     * @returns true if the order being created on WorkOrderCreateUpdate.page is a service order.
     */
    static isServiceOrderCreateUpdate(context) {
        try {
            let planningPlant = libCommon.getTargetPathValue(context, '#Page:WorkOrderCreateUpdatePage/#Control:PlanningPlantLstPkr/#SelectedValue');
            let orderType = libCommon.getTargetPathValue(context, '#Page:WorkOrderCreateUpdatePage/#Control:TypeLstPkr/#SelectedValue');
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], `$filter=PlanningPlant eq '${planningPlant}' and OrderType eq '${orderType}'`).then((result) => {
                if (result.length > 0) {
                    return Promise.resolve(result.getItem(0).ServiceType === 'X');
                }
                return Promise.resolve(false);
            }).catch((error) => {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(),`isServiceOrderCreateUpdate(context) Error: ${error}`);
                return Promise.resolve(false);
            });
        } catch (err) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(),`isServiceOrderCreateUpdate(context) Error: ${err}`);
            return Promise.resolve(false);
        }
    }

    /**
     * Checks if sold party required.
     * @param {*} context 
     * @returns {boolean}
     */
    static isSoldPartyRequired(context) {
        try {
            const orderType = libCommon.getTargetPathValue(context, '#Page:WorkOrderCreateUpdatePage/#Control:TypeLstPkr/#SelectedValue');
            const partnerFunc = PartnerFunction.getSoldToPartyPartnerFunction();
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'PartnerDetProcs', [], `$filter=OrderType eq '${orderType}' and PartnerFunction eq '${partnerFunc}'`).then((result) => {
                if (result.length > 0) {
                    return Promise.resolve(result.getItem(0).PartnerIsMandatory === 'X');
                }
                return Promise.resolve(false);
                }).catch((error) => {
                    Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(),`isSoldPartyRequired(context) Error: ${error}`);
                    return Promise.resolve(false);
                });
        } catch (err) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(),`isSoldPartyRequired(context) Error: ${err}`);
            return Promise.resolve(false);
        }
    }

    static setServiceOrderCreateUpdateFields(context) {
        let binding = context.getPageProxy().binding;
        if (binding.FromNotification) {
            //No need to set visibility for soldToPartyLstPkr & accountIndicatorLstPkr. Both fields should already be visible.
            return Promise.resolve();
        }
        try {
            return libWo.isServiceOrderCreateUpdate(context).then((isServiceOrder) => {
                let formCellContainer = context.getControl('FormCellContainer');
                let soldToPartyLstPkr = formCellContainer.getControl('SoldToPartyLstPkr');
                let accountIndicatorLstPkr = formCellContainer.getControl('AccountIndicatorLstPkr');
                //Show or hide soldToPartyLstPkr and accountIndicatorLstPkr based on selected order type and planning plant.
                soldToPartyLstPkr.setVisible(isServiceOrder);
                accountIndicatorLstPkr.setVisible(isServiceOrder);
                return Promise.resolve();
            }).catch((err) => {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(),`setServiceOrderCreateUpdateFields(context) Error: ${err}`);
                return Promise.resolve();
            });
        } catch (error) {
            Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(),`setServiceOrderCreateUpdateFields(context) Error: ${error}`);
            return Promise.resolve();
        }
    }
}

/**
 * This stores the Work Order page's event related methods
 */
export class WorkOrderEventLibrary {

    /**
     * Triggered when the page is loaded
     * @param {IPageProxy} pageClientAPI
     */
    static createUpdateOnPageLoad(pageClientAPI) {
        if (!pageClientAPI.getClientData().LOADED) {
            let onCreate = libCommon.IsOnCreate(pageClientAPI);
            let onFollowUp = libWo.getFollowUpFlag(pageClientAPI);

            libPrivate._setTitle(pageClientAPI, onCreate, onFollowUp);
            this.setDefaultValues(pageClientAPI, onCreate, onFollowUp);

            pageClientAPI.getClientData().LOADED = true;
        }
    }

    /**
     * execute the validation rule of Work Order Create/Update action
     *
     * @static
     * @param {IPageProxy} pageProxy
     * @return {Boolean}
     *
     * @memberof WorkOrderEventLibrary
     */
    static createUpdateValidationRule(pageProxy) {
        let valPromises = [];

        let formCellContainer = pageProxy.getControl('FormCellContainer');
        let allControls = formCellContainer.getControls();
        for (let item of allControls) {
            item.clearValidationOnValueChange();
        }
        formCellContainer.redraw();

        // get all of the validation promises
        valPromises.push(libControlDescription.validationCharLimit(pageProxy));

        // check attachment count, run the validation rule if there is an attachment
        if (libDoc.attachmentSectionHasData(pageProxy)) {
            valPromises.push(libDoc.createValidationRule(pageProxy));
        }

        // check all validation promises;
        // if all resolved -> return true
        // if at least 1 rejected -> return false
        return Promise.all(valPromises).then((results) => {
            const pass = results.reduce((total, value) => {
                return total && value;
            });
            if (!pass) {
                throw false;
            }
            return true;
        }).catch(() => {
            return false;
        });
    }

    /**
     * Triggered when one of the control has changed the value; Binded to each control
     * Have an optional parameter to determine if the rule is being called from Extension or Not
     * @param {ControlProxy} control
     * @param  {Bool} isExtensionControl
     */
    static createUpdateOnChange(control, isExtensionControl=false) {

        //check wether it is invoke from a rule or by user
        if (control.getPageProxy().getClientData().LOADED && !control.getClientData().SetValueFromRule) {
            let name = control.getName();
            // TODO: Remove this workaround when we get the hierarchy list picker support from sdk.
            // If user select a child from a hierarchy, we are losing the pageProxy binding so have to check and re-assign it.
            if (libVal.evalIsEmpty(control.getPageProxy().binding)) {
                control.getPageProxy()._context.binding = control.binding;
            }
            let context = control.getPageProxy();
            switch (name) {
                case 'PlanningPlantLstPkr':
                    return libWoControls.updateOrderType(context).then(() => {
                        return libWoControls.updateFunctionalLocation(context).then(() => {
                            return libWoControls.updateEquipment(context).then(() => {
                            //libWoControls.rebindWorkCenterPlant(context);
                            });
                        });
                    });
                case 'TypeLstPkr':
                    return libWoControls.updatePriority(context).then(() => {
                        return libWo.setServiceOrderCreateUpdateFields(context);
                    });
                case 'FunctionalLocationLstPkr':
                case 'FuncLocHierarchyExtensionControl':
                    libWoControls.updateEquipment(context, isExtensionControl).then(() => {
                        let newPlant = assnType.getWorkOrderAssignmentDefaults().PlanningPlant.default;
                        let flocSelected = isExtensionControl ? context.getControls()[0].getControl('FuncLocHierarchyExtensionControl').getValue() :
                                            libCommon.getListPickerValue(context.getControls()[0].getControl('FunctionalLocationLstPkr').getValue());
                        let planningPlant = libCommon.getListPickerValue(context.getControls()[0].getControl('PlanningPlantLstPkr').getValue());
                        let planningPlantControl = context.evaluateTargetPath('#Control:PlanningPlantLstPkr');
                        let target = '';

                        if (flocSelected) {
                            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyFunctionalLocations', ['PlanningPlant', 'WorkCenter_Main_Nav/ExternalWorkCenterId', 'WorkCenter_Main_Nav/PlantId'], "$expand=WorkCenter_Main_Nav&$filter=FuncLocIdIntern eq '" + flocSelected + "'").then(function(result) {
                                let row = result.getItem(0);
                                newPlant = row.PlanningPlant;
                                if (newPlant && (newPlant !== planningPlant)) {
                                    target = newPlant;
                                }
                                return libWo.reloadPlanningPlant(context, planningPlantControl, target, row.WorkCenter_Main_Nav);
                            });
                        } else {
                            if (newPlant && (newPlant !== planningPlant)) {
                                target = newPlant;
                            }
                            return libWo.reloadPlanningPlant(context, planningPlantControl, target);
                        }
                    });
                    break;
                case 'EquipmentLstPkr':
                case 'EquipHierarchyExtensionControl':
                    libWoControls.updateFloc(control.getPageProxy(), isExtensionControl).then(() => {
                        let newPlant = assnType.getWorkOrderAssignmentDefaults().PlanningPlant.default;
                        let flocSelected = context.getControls()[0].getControl('FuncLocHierarchyExtensionControl').getValue();
                        let equipSelected = isExtensionControl ? context.getControls()[0].getControl('EquipHierarchyExtensionControl').getValue() :
                                            libCommon.getListPickerValue(context.getControls()[0].getControl('EquipmentLstPkr').getValue());
                        let planningPlant = libCommon.getListPickerValue(context.getControls()[0].getControl('PlanningPlantLstPkr').getValue());
                        let planningPlantControl = context.evaluateTargetPath('#Control:PlanningPlantLstPkr');
                        let target = '';

                        if (equipSelected) {
                            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', ['PlanningPlant','WorkCenter_Main_Nav/ExternalWorkCenterId', 'WorkCenter_Main_Nav/PlantId'], "$expand=WorkCenter_Main_Nav&$filter=EquipId eq '" + equipSelected + "'").then(function(result) {
                                let row = result.getItem(0);
                                newPlant = row.PlanningPlant;
                                if (newPlant && (newPlant !== planningPlant)) {
                                    target = newPlant;
                                }
                                return libWo.reloadPlanningPlant(context, planningPlantControl, target, row.WorkCenter_Main_Nav);
                            });
                        } else if (flocSelected) {
                            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyFunctionalLocations', ['PlanningPlant','WorkCenter_Main_Nav/ExternalWorkCenterId', 'WorkCenter_Main_Nav/PlantId'], "$expand=WorkCenter_Main_Nav&$filter=FuncLocIdIntern eq '" + flocSelected + "'").then(function(result) {
                                let row = result.getItem(0);
                                newPlant = row.PlanningPlant;
                                if (newPlant && (newPlant !== planningPlant)) {
                                    target = newPlant;
                                }
                                return libWo.reloadPlanningPlant(context, planningPlantControl, target, row.WorkCenter_Main_Nav);
                            });
                        } else {
                            if (newPlant && (newPlant !== planningPlant)) {
                                target = newPlant;
                            }
                            return libWo.reloadPlanningPlant(context, planningPlantControl, target);
                        }
                    });
                    break;
                case 'WorkCenterPlantLstPkr':
                    libWoControls.updateMainWorkCenter(context);
                    break;
                default:
                    break;
            }

            //JCL - Not doing this for now.  Put in place when we can handle for all fields
            if (!libVal.evalIsEmpty(control.getValue())) {
                control.clearValidationOnValueChange();
            }
        } else {
            //value is set or changed by the user, not from rule or code behind
            control.getClientData().SetValueFromRule = false;
        }
        return Promise.resolve(true);
    }

    /**
     * Set controls' visibility
     * @param {IPageProxy} pageProxy
     * @param {boolean} isOnCreate
     */
    static createUpdateVisibility(control) {

        let controlName = control.getName();
        let isOnCreate = libCommon.IsOnCreate(control.getPageProxy());
        let result = false;

        switch (controlName) {
            case 'LongTextNote':
                result = libPrivate._shouldNoteVisible(isOnCreate);
                break;
            case 'Marked':
                result = libPrivate._shouldMarkedJobSwitchVisible(isOnCreate);
                break;
            default:
                result = true;
        }

        return result;
    }

    /**
     * This will returns the correct QueryOptions for each control
     * @param {IControlProxy} controlProxy
     */
    static createUpdateControlsQueryOptions(controlProxy) {
        let controlName;
        let context;
        try {
            controlName = controlProxy.getName();
            context = controlProxy.getPageProxy();
        } catch (err) {
            controlProxy = controlProxy.binding.clientAPI;
            controlName = controlProxy.getName();
            context = controlProxy.getPageProxy();
        }


        //Determine if we are on create
        let onCreate = libCommon.IsOnCreate(context);
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue())) {
            return this.MeterWorkOrderCreateUpdateQueryOptions(context, controlProxy, controlName, onCreate);
        } else {
            return this.WorkOrderCreateUpdateQueryOptions(context, controlProxy, controlName, onCreate);
        }
        
    }
    static WorkOrderCreateUpdateQueryOptions(context, controlProxy, controlName, onCreate) {
        var result = '';
        // Based on the control we are on, return the right query or list items accordingly
        switch (controlName) {
            case 'TypeLstPkr':
                {
                    let planningPlant = '';
                    if (onCreate) {
                        let target = libCommon.getStateVariable(context, 'WODefaultPlanningPlant');
                        if (target) {
                            planningPlant = target;
                        } else {
                            planningPlant = assnType.getWorkOrderFieldDefault('WorkOrderHeader', 'PlanningPlant');
                        }
                    } else {
                        planningPlant = libCommon.getTargetPathValue(controlProxy, '#Property:PlanningPlant');
                    }

                    if (PersonaLibrary.isFieldServiceTechnician(context)) {
                        return WorkOrdersFSMQueryOption(context).then(fsmQueryOptions => {
                            let queryOption = `$filter=(PlanningPlant eq '${planningPlant}')`;
                            if (!libVal.evalIsEmpty(fsmQueryOptions)) {
                                queryOption += ' and ' + fsmQueryOptions;
                            }
                            return queryOption + '&$orderby=OrderType';
                        });
                    } else {
                        result = `$filter=(PlanningPlant eq '${planningPlant}')&$orderby=OrderType`;
                        break;
                    }
                }
            case 'PrioritySeg':
                {
                //Priority is based on PriorityType property that live inside OrderTypes
                    result = libPrivate._prioritySeg(controlProxy, onCreate);
                    break;
                }
            case 'FunctionalLocationLstPkr':
            case 'FuncLocHierarchyExtensionControl':
                {
                    //if on create, get the default value from app param
                    let planningPlant = onCreate ? assnType.getWorkOrderFieldDefault('WorkOrderHeader', 'PlanningPlant') : libCommon.getTargetPathValue(controlProxy, '#Property:PlanningPlant');
                    let target = libCommon.getStateVariable(context, 'WODefaultPlanningPlant');
                    if (target) {
                        planningPlant = target;
                    }
                    result = `$orderby=FuncLocId&$filter=(PlanningPlant eq '' or PlanningPlant eq '${planningPlant}')`;
                    break;
                }
            case 'EquipmentLstPkr':
            case 'EquipHierarchyExtensionControl':
                {
                    let funcLoc;
                    if (controlName === 'EquipHierarchyExtensionControl') {
                        funcLoc = context.getControl('FormCellContainer').getControl('FuncLocHierarchyExtensionControl').getValue();
                    }
                    if (!funcLoc && funcLoc !== '') {
                        funcLoc = libCommon.getTargetPathValue(controlProxy, '#Property:HeaderFunctionLocation');
                    }
                    let planningPlant = onCreate ? assnType.getWorkOrderFieldDefault('WorkOrderHeader', 'PlanningPlant') : libCommon.getTargetPathValue(controlProxy, '#Property:PlanningPlant');
                    let target = libCommon.getStateVariable(context, 'WODefaultPlanningPlant');
                    if (target) {
                        planningPlant = target;
                    }
                    if (funcLoc) {
                        result = "$orderby=EquipId&$filter=(FuncLocIdIntern eq '" + funcLoc + "')";
                    } else {
                        result = "$orderby=EquipId&$filter=(PlanningPlant eq '' or PlanningPlant eq '" + planningPlant + "')";
                    }
                    break;
                }
                case 'MainWorkCenterLstPkr':
                {
                    let plant = assnType.getWorkOrderAssignmentDefaults().WorkCenterPlant.default;
                    let target = libCommon.getStateVariable(context, 'WODefaultWorkCenterPlant');
                    if (target) {
                        plant = target;
                    }
                    if (!onCreate) {
                        plant= libCommon.getTargetPathValue(controlProxy, '#Property:MainWorkCenterPlant');
                    }
                    if (!plant) {
                        plant= '';
                    }
                    result = "$orderby=ExternalWorkCenterId&$filter=PlantId eq '" + plant + "'";
                    break;
                }
            default:
                break;
        }

        return Promise.resolve(result);
    }
    static MeterWorkOrderCreateUpdateQueryOptions(context, controlProxy, controlName, onCreate) {
        var result = '';
        // Based on the control we are on, return the right query or list items accordingly
        switch (controlName) {
            case 'TypeLstPkr':
                {
                    let planningPlant = '';
                    if (onCreate) {
                    //need order type from App config
                        planningPlant = assnType.getWorkOrderFieldDefault('WorkOrderHeader', 'PlanningPlant');
                        result = `$filter=PlanningPlant eq '${planningPlant}' and ServiceType ne 'X'&$orderby=OrderType`;
                    } else {
                        planningPlant = libCommon.getTargetPathValue(controlProxy, '#Property:PlanningPlant');
                    // Need to show Service Orders on edit, if current type is a service order
                        result = controlProxy.read('/SAPAssetManager/Services/AssetManager.service', `OrderTypes(OrderType='${context.binding.OrderType}',PlanningPlant='${planningPlant}')`, [], '').then(function(otResult) {
                            let orderType = otResult.getItem(0);
                            if (orderType.ServiceType === 'X') {
                                return `$filter=PlanningPlant eq '${planningPlant}'&$orderby=OrderType`;
                            } else {
                                return `$filter=PlanningPlant eq '${planningPlant}' and ServiceType ne 'X'&$orderby=OrderType`;
                            }
                        });
                    }

                    break;
                }
            case 'PrioritySeg':
                {
                    let woOrderType = onCreate ? libCommon.getAppParam(controlProxy, 'WORKORDER', 'OrderType') : libCommon.getTargetPathValue(controlProxy, '#Property:OrderType');
                    result = controlProxy.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], `$filter=OrderType eq '${woOrderType}'`).then(function(myOrderTypes) {
                        let record = myOrderTypes.getItem(0);
                        return "$filter=PriorityType eq '" + record.PriorityType + "'&$orderby=Priority";
                    });
                    break;
                }
            case 'FunctionalLocationLstPkr':
            case 'FuncLocHierarchyExtensionControl':
                {
                //if on create, get the default value from app param
                    let planningPlant = onCreate ? assnType.getWorkOrderFieldDefault('WorkOrderHeader', 'PlanningPlant') : libCommon.getTargetPathValue(context, '#Property:PlanningPlant');
                    result = `$orderby=FuncLocId&$filter=PlanningPlant eq '${planningPlant}'`;
                    break;
                }
            case 'EquipmentLstPkr':
            case 'EquipHierarchyExtensionControl':
                {
                    let funcLoc;
                    if (controlName === 'EquipHierarchyExtensionControl') {
                        funcLoc = context.getControl('FormCellContainer').getControl('FuncLocHierarchyExtensionControl').getValue();
                    }
                    if (!funcLoc && funcLoc !== '') {
                        funcLoc = libCommon.getTargetPathValue(controlProxy, '#Property:HeaderFunctionLocation');
                    }
                    if (funcLoc && funcLoc !== '') {
                        result = "$orderby=EquipId&$filter=FuncLocId eq '" + funcLoc + "'";
                    } else {
                        result = '$orderby=EquipId';
                    }
                    break;
                }
            default:
                break;
        }
        return Promise.resolve(result);
    }
    /**
     * This will returns the correct PickerItems for the Picker Controls
     * @param {IControlProxy} controlProxy
     */
    static createUpdateControlsPickerItems(controlProxy) {
        let controlName = controlProxy.getName();

        //Determine if we are on create
        //let onCreate = libCommon.IsOnCreate(controlProxy.getPageProxy());

        // Based on the control we are on, return the right list items accordingly
        if (controlName === 'PlanningPlantLstPkr') {
            return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], '$orderby=PlanningPlant').then(obArray => {
                var jsonResult = [];
                obArray.forEach(function(element) {
                    jsonResult.push(
                        {
                            'DisplayValue': `${element.PlanningPlant} - ${element.PlantDescription}`,
                            'ReturnValue': element.PlanningPlant,
                        });
                });
                const uniqueSet = new Set(jsonResult.map(item => JSON.stringify(item)));
                let finalResult = [...uniqueSet].map(item => JSON.parse(item));
                return finalResult;
            });
        } else if (controlName === 'WorkCenterPlantLstPkr') {
            //TODO - AssignmentType case scenario will be needed here after more AssignmentType are introduced
            //let planningPlant = onCreate ? appParams.get('PlanningPlant') : libCommon.getTargetPathValue(controlProxy, '#Property:PlanningPlant');
            //let mainWorkCenter = userInfo.get('USER_PARAM.AGR');
            //let queryOption = `$filter=PlantId eq '${planningPlant}' and ExternalWorkCenterId eq '${mainWorkCenter}'`;

            return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', [], '').then(function(obArray) {
                var jsonResult = [];
                obArray.forEach(function(element) {
                    jsonResult.push(
                        {
                            'DisplayValue': `${element.PlantId} - ${element.WorkCenterName}`,
                            'ReturnValue': element.PlantId,
                        });
                });
                const uniqueSet = new Set(jsonResult.map(item => JSON.stringify(item)));
                let finalResult = [...uniqueSet].map(item => JSON.parse(item));
                return finalResult;
            });
        } else {
            return Promise.resolve([]);
        }
    }

    /**
     * Triggered when the user hit "Save" button
     * @param {IPageProxy} pageProxy
     */
    static CreateUpdateOnCommit(pageProxy) {
        //Determine if we are on edit vs. create
        let onCreate = libCommon.IsOnCreate(pageProxy);

        if (onCreate) {
            return libWo.isServiceOrderCreateUpdate(pageProxy).then(isServiceOrder => {
                //get the value from controls that need to pass to Operation create
                let planningPlant = libWoControls.getPlanningPlant(pageProxy);
                let workCenter = libWoControls.getMainWorkCenter(pageProxy);
                let workCenterPlant = libWoControls.getWorkCenterPlant(pageProxy);
                let orderType = libWoControls.getOrderType(pageProxy);
                let equipment = pageProxy.getControl('FormCellContainer').getControl('EquipHierarchyExtensionControl').getValue();
                let floc = pageProxy.getControl('FormCellContainer').getControl('FuncLocHierarchyExtensionControl').getValue();
                let description = libCommon.getTargetPathValue(pageProxy, '#Page:WorkOrderCreateUpdatePage/#Control:DescriptionNote/#Value');
    
                let woDefaultValue = {
                    'PlanningPlant': planningPlant,
                    'MainWorkCenter': workCenter,
                    'MainWorkCenterPlant': workCenterPlant,
                    'OrderType': orderType,
                    'Description': description,
                    'Equipment': equipment,
                    'FunctionalLocation': floc,
                };
    
                libCommon.setStateVariable(pageProxy, 'WorkOrder', woDefaultValue);
                libCommon.setStateVariable(pageProxy, 'FromOperationsList', false);
                let descriptionCtrlValue = pageProxy.getControl('FormCellContainer').getControl('AttachmentDescription').getValue();
                let attachmentCtrlValue = pageProxy.getControl('FormCellContainer').getControl('Attachment').getClientData().AddedAttachments;
                libCommon.setStateVariable(pageProxy, 'DocDescription', descriptionCtrlValue);
                libCommon.setStateVariable(pageProxy, 'Doc', attachmentCtrlValue);
                libCommon.setStateVariable(pageProxy, 'Class', isServiceOrder ? 'ServiceOrder' : 'WorkOrder');
                libCommon.setStateVariable(pageProxy, 'ObjectKey', 'OrderId');
                libCommon.setStateVariable(pageProxy, 'entitySet' ,'MyWorkOrderDocuments');
                libCommon.setStateVariable(pageProxy,'parentEntitySet', 'MyWorkOrderHeaders');
                libCommon.setStateVariable(pageProxy,'parentProperty', 'WOHeader');
                libCommon.setStateVariable(pageProxy,'attachmentCount', DocLib.validationAttachmentCount(pageProxy));
    
                return pageProxy.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationCreateUpdateNav.action');
            });
        } else {
            return markedJobCreateUpdateOnCommit(pageProxy).then(() => {
                return pageProxy.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderUpdate.action');
            });
        }
    }

    /**
     * set the default values of the page's control
     *
     * @static
     * @param {IPageProxy} pageProxy
     * @param {Map} userInfo
     * @param {boolean} onCreate
     * @param {boolean} onFollowUp
     *
     * @memberof WorkOrderEventLibrary
     */
    static setDefaultValues(pageProxy, onCreate, onFollowUp) {
        if (onCreate && onFollowUp) {
            let descriptionControl = libCommon.getControlProxy(pageProxy, 'DescriptionNote');
            descriptionControl.setValue(descriptionControl.getValue());

            let priorityCtrl = libCommon.getControlProxy(pageProxy, 'PrioritySeg');
            priorityCtrl.setValue(ConstantsLibrary.defaultPriority);

        } else {
            let formCellContainer = pageProxy.getControl('FormCellContainer');
            let stylizer = new Stylizer(['GrayText']);
            let plantPkr = formCellContainer.getControl('PlanningPlantLstPkr');
            let wrkCenterPkr = formCellContainer.getControl('WorkCenterPlantLstPkr');
            let mainWrkCenterPkr = formCellContainer.getControl('MainWorkCenterLstPkr');
            stylizer.apply(plantPkr , 'Value');
            stylizer.apply(wrkCenterPkr, 'Value');
            stylizer.apply(mainWrkCenterPkr, 'Value');
        }

        let typePkr = pageProxy.getControl('FormCellContainer').getControl('TypeLstPkr');
        typePkr.setEditable(onCreate);

        pageProxy.getClientData().DefaultValuesLoaded = true;
    }

    static createOnSuccess(pageProxy) {
        let assignmentType = libCommon.getWorkOrderAssignmentType(pageProxy);

        switch (assignmentType) {
            case '1':
                // Header Level - WorkOrderPartner
                return pageProxy.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderPartnerCreate.action');
            case '2':
                // Operation Level - Personel Number
                return ExecuteActionWithAutoSync(pageProxy, '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action');
            case '3':
                // Sub Operation Level - Personel Number
                return ExecuteActionWithAutoSync(pageProxy, '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action');
            case '4':
                // Operation Level - Employee ID
                return pageProxy.executeAction('/SAPAssetManager/Actions/Page/ClosePageNextChangeset.action');
            case '5':
                // Header Level - Planner Group
                return pageProxy.executeAction('/SAPAssetManager/Actions/Page/ClosePageNextChangeset.action');
            case '6':
                // Operation Level - Work Center
                return pageProxy.executeAction('/SAPAssetManager/Actions/Page/ClosePageNextChangeset.action');
            case '7':
                // Header Level - Business Partner
                return pageProxy.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderPartnerCreate.action');
            case '8':
                // Header Level - Work Center
                return pageProxy.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationCreateUpdateNav.action');
            case 'A':
                // Operation Level - MRS (N/A)
                return Promise.resolve(true);
            default:
                //assuming default is 8
                return pageProxy.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationCreateUpdateNav.action');
        }
    }

    /**
	 * Used for formatting and adding data to WorkOrders list view
     * @param context WorkOrderListView page context
	 */
    static WorkOrdersListViewFormat(context) {
        var section = context.getName();
        var property = context.getProperty();
        var binding = context.binding;
        var value = '';
        var clientData = libCommon.getClientDataForPage(context);
        switch (section) {
            case 'WorkOrdersListSection':
            case 'SupervisorSectionForWorkOrders':
            case 'TechnicianSectionForWorkOrders':
            case 'HighPriorityOrdersSection':
            case 'ServiceOrders':
                switch (property) {
                    case 'StatusText':
                        try {
                            //Priorities and OrderTypes were cached prior to list screen loading
                            value = clientData.Priorities[clientData.OrderTypes[binding.OrderType].PriorityType + binding.Priority].PriorityDescription;
                            break;
                        } catch (err) {
                            break;
                        }
                    case 'SubstatusText':
                        value = libWoMobile.headerMobileStatus(context).then((mStatus) => {
                            var woStarted = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
                            if (libClock.isBusinessObjectClockedIn(context) && libClock.allowClockInOverride(context, mStatus)) { //Clock in/out feature enabled and user is clocked in to this WO, regardless of mobile status
                                return context.localizeText(woStarted) + '-' + context.localizeText('clocked_in');
                            } else {
                                if (mStatus === 'D-COMPLETE') {
                                    return '';
                                }
                                return context.localizeText(mStatus);
                            }
                        });
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
        return value;
    }

    /**
	 * Used for formatting and adding data to SubOperations list view
     * @param context SubOperationsListView page context
	 */
    static SubOperationsListViewFormat(context) {
        var section = context.getName();
        var property = context.getProperty();

        if ((property === 'SubstatusText') && (section === 'WorkOrderSubOperationListSection')) {
            if (libClock.isBusinessObjectClockedIn(context)) {
                    var stringForSubOpSubtext = context.localizeText('clocked_in');
                    return stringForSubOpSubtext;
                }
            }
            return '';
    }

    /**
	 * Used for formatting and adding data to Operations list view
     * @param context WorkOrderOperationsListView page context
	 */
    static WorkOrderOperationsListViewFormat(context) {
        var section = context.getName();
        var property = context.getProperty();
        var status =  OperationMobileStatus(context);
        var woStarted = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        var complete = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());

        if (((property === 'StatusText') && (section === 'WorkOrderOperationListSection')) || (section === 'OperationsObjectTable')) {
            return libMobile.isMobileStatusConfirmed(context).then(function(confirmed) {
                if (confirmed) {
                    return context.localizeText(complete);
                } else if (libClock.isBusinessObjectClockedIn(context) && libClock.allowClockInOverride(context, status)) { //Clock in/out feature enabled and user is clocked in to this Operation, regardless of mobile status
                    return context.localizeText(woStarted) + '-' + context.localizeText('clocked_in');
                } else {
                    return status;
                }
            });
        }
        if (((property === 'SubstatusText') && (section === 'SupervisorSectionForOperations')) || (section === 'TechnicianSectionForOperations') || section === 'ServiceOperations') {
            if (libClock.isBusinessObjectClockedIn(context) && libClock.allowClockInOverride(context, status)) { //Clock in/out feature enabled and user is clocked in to this Operation, regardless of mobile status
                return context.localizeText(woStarted) + '-' + context.localizeText('clocked_in');
            } else {
                return status;
            }
        }
        return '';
    }
}

/**
 * The following class stores all of the Work Order controls specific methods
 */
export class WorkOrderControlsLibrary {

    /**
     * Planning Plant getter
     * @param {IPageProxy} pageProxy
     */
    static getPlanningPlant(pageProxy) {
        let planningPlant = libCommon.getTargetPathValue(pageProxy, '#Page:WorkOrderCreateUpdatePage/#Control:PlanningPlantLstPkr/#Value');
        return libCommon.getListPickerValue(planningPlant);
    }

    /**
     * OrderType getter
     * @param {IPageProxy} pageProxy
     */
    static getOrderType(pageProxy) {
        let orderType = libCommon.getTargetPathValue(pageProxy, '#Page:WorkOrderCreateUpdatePage/#Control:TypeLstPkr/#Value');
        return libCommon.getListPickerValue(orderType);
    }

    /**
     * Priority getting
     * @param {IPageProxy} pageProxy
     */
    static getPriority(pageProxy) {
        let priorty = libCommon.getTargetPathValue(pageProxy, '#Page:WorkOrderCreateUpdatePage/#Control:PrioritySeg/#Value');
        return libCommon.getListPickerValue(priorty);
    }

    /**
     * Funcational Location getter
     * @param {IPageProxy} pageProxy
     */
    static getFunctionalLocation(pageProxy) {
        let funcLocControl = pageProxy.evaluateTargetPath('#Page:WorkOrderCreateUpdatePage/#Control:FuncLocHierarchyExtensionControl');
        if (funcLocControl !== undefined && funcLocControl.getValue() !== undefined) {
            return funcLocControl.getValue();
        }
        return '';
    }

    /**
     * FunctionalLocation getter
     * @param {IPageProxy} pageProxy
     */
     static getFunctionalLocationValue(pageProxy) {
        let funcLocControl = pageProxy.evaluateTargetPath('#Page:WorkOrderCreateUpdatePage/#Control:FuncLocHierarchyExtensionControl');
        if (funcLocControl !== undefined && funcLocControl.getValue() !== undefined) {
            let floc =  funcLocControl.getValue();
            if (libCommon.isCurrentReadLinkLocal(floc)) {
                return libCommon.getEntityProperty(pageProxy, `MyFunctionalLocations(${floc})`, 'FuncLocIdIntern').then(flocIdIntern => {
                    return flocIdIntern;
                });
            }
            return floc;
        }
        return '';
    }


    /**
     * Equipment getter
     * @param {IPageProxy} pageProxy
     */
    static getEquipment(pageProxy) {
        let equipControl = pageProxy.evaluateTargetPath('#Page:WorkOrderCreateUpdatePage/#Control:EquipHierarchyExtensionControl');
        if (equipControl !== undefined && equipControl.getValue() !== undefined) {
            return equipControl.getValue();
        }
        return '';
    }

    /**
     * Equipment getter
     * @param {IPageProxy} pageProxy
     */
     static getEquipmentValue(pageProxy) {
        let equipControl = pageProxy.evaluateTargetPath('#Page:WorkOrderCreateUpdatePage/#Control:EquipHierarchyExtensionControl');
        if (equipControl !== undefined && equipControl.getValue() !== undefined) {
            let equipment =  equipControl.getValue();
            if (libCommon.isCurrentReadLinkLocal(equipment)) {
                return libCommon.getEntityProperty(pageProxy, `MyEquipments(${equipment})`, 'EquipId').then(equipmentId => {
                    return equipmentId;
                });
            }
            return equipment;
        }
        return '';
    }

    /**
     * BusinessArea getter
     * @param {IPageProxy} pageProxy
     */
    static getBusinessArea(pageProxy) {
        let businessArea = libCommon.getTargetPathValue(pageProxy, '#Page:WorkOrderCreateUpdatePage/#Control:BusinessAreaLstPkr/#Value');
        return libCommon.getListPickerValue(businessArea);
    }

    /**
     * WorkCenterPlant getter
     * @param {IPageProxy} pageProxy
     */
    static getWorkCenterPlant(pageProxy) {
        let workCenterPlant = libCommon.getTargetPathValue(pageProxy, '#Page:WorkOrderCreateUpdatePage/#Control:WorkCenterPlantLstPkr/#Value');
        return libCommon.getListPickerValue(workCenterPlant);
    }

    /**
     * MainWorkCenter getter
     * @param {IPageProxy} pageProxy
     */
    static getMainWorkCenter(pageProxy) {
        let mainWorkCenter = libCommon.getTargetPathValue(pageProxy, '#Page:WorkOrderCreateUpdatePage/#Control:MainWorkCenterLstPkr/#Value');
        return libCommon.getListPickerValue(mainWorkCenter);
    }

    /**
     * Update the order type control
     * @param {IPageProxy} pageProxy
     */
    static updateOrderType(pageProxy) {
        try {
            let formCellContainer = pageProxy.getControl('FormCellContainer');
            let planningPlantControl = formCellContainer.getControl('PlanningPlantLstPkr');
            let typeControl = formCellContainer.getControl('TypeLstPkr');
            let typeControlValue = libCommon.getListPickerValue(formCellContainer.getControl('TypeLstPkr').getValue());
            var typeCtrlSpecifier = typeControl.getTargetSpecifier();
            let plantPickerValue = libCommon.getListPickerValue(planningPlantControl.getValue());
            if (libCommon.getStateVariable(pageProxy, 'TypePlanningPlant')) {
                plantPickerValue = libCommon.getStateVariable(pageProxy, 'TypePlanningPlant');
                libCommon.removeStateVariable(pageProxy, 'TypePlanningPlant');
            }
            typeCtrlSpecifier.setQueryOptions("$filter=PlanningPlant eq '" + plantPickerValue + "'&$orderby=OrderType");
            return typeControl.setTargetSpecifier(typeCtrlSpecifier).then(() => {
                if (typeControlValue) {
                    typeControl.setValue(typeControlValue);
                } else {
                    typeControl.setValue(libCommon.getAppParam(pageProxy, 'WORKORDER', 'OrderType'));
                }
                return Promise.resolve(true);
            });
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(),`updateOrderType Error: ${err}`);
            return Promise.resolve(true);
        }
    }

    static rebindWorkCenterPlant(pageProxy) {
        let formCellContainer = pageProxy.getControl('FormCellContainer');
        let wcp = formCellContainer.getControl('WorkCenterPlantLstPkr');
        wcp.redraw();
    }

    /**
     * Update Main Work Center control
     * @param {IPageProxy} pageProxy
     */
    static updateMainWorkCenter(pageProxy) {
        try {
            let formCellContainer = pageProxy.getControl('FormCellContainer');
            let workCenterPlantControlValue = libCommon.getListPickerValue(formCellContainer.getControl('WorkCenterPlantLstPkr').getValue());
            let mainWorkCenterControl = formCellContainer.getControl('MainWorkCenterLstPkr');
            let workCenterPlantSpecifier = mainWorkCenterControl.getTargetSpecifier();

            if (libCommon.getStateVariable(pageProxy, 'ResetWorkCenterPlant')) {
                workCenterPlantControlValue = libCommon.getStateVariable(pageProxy, 'ResetWorkCenterPlant');
                libCommon.removeStateVariable(pageProxy, 'ResetWorkCenterPlant');
            }
            workCenterPlantSpecifier.setQueryOptions("$orderby=ExternalWorkCenterId&$filter=PlantId eq '" + workCenterPlantControlValue + "'");
            return mainWorkCenterControl.setTargetSpecifier(workCenterPlantSpecifier).then(() => {
                if (libCommon.getStateVariable(pageProxy, 'ResetWorkCenter')) {
                    mainWorkCenterControl.setValue(libCommon.getStateVariable(pageProxy, 'ResetWorkCenter'));
                    libCommon.removeStateVariable(pageProxy, 'ResetWorkCenter');
                }
                return Promise.resolve(true);
            });
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(),`updateMainWorkCenter Error: ${err}`);
            return Promise.resolve(false);
        }
    }

    /**
     * Update Priority control
     * @param {IPageProxy} pageProxy
     */
    static updatePriority(pageProxy) {
        try {
            // you need to get OrderType, then find out PriorityType that is associated with that OrderType;
            // because Priority depends on PriorityType property in OrderType
            let formCellContainer = pageProxy.getControl('FormCellContainer');
            let planningPlantValue = libCommon.getListPickerValue(formCellContainer.getControl('PlanningPlantLstPkr').getValue());
            let orderTypeValue = libCommon.getListPickerValue(formCellContainer.getControl('TypeLstPkr').getValue());

            return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], `$filter=OrderType eq '${orderTypeValue}' and PlanningPlant eq '${planningPlantValue}'`)
                .then(function(myOrderTypes) {
                    let priorityType = '';
                    if (myOrderTypes && myOrderTypes.length > 0) {
                        priorityType = myOrderTypes.getItem(0).PriorityType;
                    }
                    let priorityControl = formCellContainer.getControl('PrioritySeg');
                    var priortiyCtrlSpecifier = priorityControl.getTargetSpecifier();

                    if (priorityType) {
                        priortiyCtrlSpecifier.setQueryOptions(`$filter=PriorityType eq '${priorityType}'&$orderby=Priority`);
                    } else {
                        priortiyCtrlSpecifier.setQueryOptions('$orderby=Priority');
                    }

                    return priorityControl.setTargetSpecifier(priortiyCtrlSpecifier).then(() => {
                        priorityControl.setValue(ConstantsLibrary.defaultPriority);
                        return Promise.resolve(true);
                    });
                });

        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(),`updatePriority Error: ${err}`);
            return Promise.resolve(false);
        }
    }

    /**
     * Update Functional Location control
     * @param {IPageProxy} pageProxy
     */
    static updateFunctionalLocation(pageProxy) {
        try {
            let formCellContainer = pageProxy.getControl('FormCellContainer');
            let planningPlantControlValue = libCommon.getListPickerValue(formCellContainer.getControl('PlanningPlantLstPkr').getValue());
            let funcLocControl = formCellContainer.getControl('FuncLocHierarchyExtensionControl');
            let funcLocControlValue = formCellContainer.getControl('FuncLocHierarchyExtensionControl').getValue();
            var funLocCtrlSpecifier = funcLocControl.getTargetSpecifier();

            if (planningPlantControlValue) {
                funLocCtrlSpecifier.setQueryOptions("$filter=(PlanningPlant eq '' or PlanningPlant eq '" + planningPlantControlValue + "')&$orderby=FuncLocIdIntern");
            } else {
                funLocCtrlSpecifier.setQueryOptions("$filter=(PlanningPlant eq '')&$orderby=FuncLocIdIntern");
            }
            return funcLocControl.setTargetSpecifier(funLocCtrlSpecifier).then(() => {
                if (funcLocControlValue) {
                    funcLocControl.setValue(funcLocControlValue);
                }
                return Promise.resolve(true);
            });
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(),`updateFunctionalLocation Error: ${err}`);
            return Promise.resolve(false);
        }
    }

    /**
     * Update Equipment control
     * Have an optional parameter to determine if the rule is being called from Extension or Not
     * @param {IPageProxy} pageProxy
     * @param  {Bool} isExtensionControl
     */
    static updateEquipment(pageProxy, isExtensionControl=false) {
        try {
            let formCellContainer = pageProxy.getControl('FormCellContainer');
            let funcLocControlValue = isExtensionControl ? formCellContainer.getControl('FuncLocHierarchyExtensionControl').getValue() :
                                      libCommon.getListPickerValue(formCellContainer.getControl('FunctionalLocationLstPkr').getValue());
            let equipmentControl = formCellContainer.getControl('EquipmentLstPkr');
            let equipmentControlValue = isExtensionControl ? formCellContainer.getControl('EquipHierarchyExtensionControl').getValue() :
                                        libCommon.getListPickerValue(formCellContainer.getControl('EquipmentLstPkr').getValue());
            let planningPlantControlValue = libCommon.getListPickerValue(formCellContainer.getControl('PlanningPlantLstPkr').getValue());
            if (isExtensionControl) {
                let extension = formCellContainer.getControl('EquipHierarchyExtensionControl')._control._extension;
                return extension.reload().then(() => {
                    if (funcLocControlValue && equipmentControlValue) {
                        extension.setData(equipmentControlValue);
                    }
                    return Promise.resolve(true);
                });
            } else {
                var equipmentCtrlSpecifier = equipmentControl.getTargetSpecifier();
                if (funcLocControlValue) {
                    equipmentCtrlSpecifier.setQueryOptions("$orderby=EquipId&$filter=(FuncLocIdIntern eq '" + funcLocControlValue + "')");
                } else if (planningPlantControlValue) {
                    equipmentCtrlSpecifier.setQueryOptions("$orderby=EquipId&$filter=(PlanningPlant eq '' or PlanningPlant eq '" + planningPlantControlValue + "')");
                } else {
                    equipmentCtrlSpecifier.setQueryOptions("$orderby=EquipId&$filter=(PlanningPlant eq '')");
                }
                return equipmentControl.setTargetSpecifier(equipmentCtrlSpecifier).then(() => {
                    if (equipmentControlValue) {
                        equipmentControl.setValue(equipmentControlValue);
                    }
                    return Promise.resolve(true);
                });
            }
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(),`UpdateEquipment Error: ${err}`);
            return Promise.resolve(false);
        }
    }

    /**
     * Update Functional Location control
     * Have an optional parameter to determine if the rule is being called from Extension or Not
     * @param {IPageProxy} pageProxy
     * @param  {Bool} isExtensionControl
     */
    static updateFloc(pageProxy, isExtensionControl=false) {
        try {
            let formCellContainer = pageProxy.getControl('FormCellContainer');
            let funcLocControl = isExtensionControl ? formCellContainer.getControl('FuncLocHierarchyExtensionControl') : formCellContainer.getControl('FunctionalLocationLstPkr');

            let equipmentControlValue = isExtensionControl ? formCellContainer.getControl('EquipHierarchyExtensionControl').getValue() :
                                        formCellContainer.getControl('EquipmentLstPkr').getValue();
            if (isExtensionControl) {
                let extension = formCellContainer.getControl('FuncLocHierarchyExtensionControl')._control._extension;
                return extension.reload().then(() => {
                    if (equipmentControlValue) {
                        return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', ['FuncLocIdIntern'], `$filter=EquipId eq '${equipmentControlValue}'&$expand=FunctionalLocation&$orderby=EquipId`).then( results => {
                            if (results.length > 0 && results.getItem(0).FuncLocIdIntern) {
                                extension.setData(results.getItem(0).FuncLocIdIntern);
                            } else {
                                funcLocControl.setData('');
                            }
                            return Promise.resolve(true);
                        });
                    }
                    return Promise.resolve(true);
                });
            } else {
                if (equipmentControlValue && libCommon.getListPickerValue(equipmentControlValue) !== '') {
                    return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', ['FuncLocIdIntern'], `$filter=EquipId eq '${libCommon.getListPickerValue(equipmentControlValue)}'&$expand=FunctionalLocation&$orderby=EquipId`).then( results => {
                        if (results.length > 0 && results.getItem(0).FuncLocIdIntern) {
                            funcLocControl.setValue(results.getItem(0).FuncLocIdIntern, false);
                        } else {
                            funcLocControl.setValue(''); //Equipment has no FLOC
                        }
                        return Promise.resolve(true);
                    });
                }
            }
        } catch (err) {
            /**Implementing our Logger class*/
            Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryWorkOrders.global').getValue(),`UpdateFloc Error: ${err}`);
            return Promise.resolve(false);
        }
        return Promise.resolve(true);
    }

}

export class PrivateMethodsLibrary {

    static _setTitle(context, onCreate, onFollowUp) {
        let title = '';
        let isFST = PersonaLibrary.isFieldServiceTechnician(context);

        if (onCreate) {
            if (onFollowUp) {
                title = context.localizeText('add_order');
            } else {
                title = isFST ? context.localizeText('add_service_order') : context.localizeText('add_workorder');
            }
        } else {
            title = isFST ? context.localizeText('edit_service_order') : context.localizeText('edit_workorder');
        }
        context.setCaption(title);
    }

    static _isWorkCenterEditable(isOnCreate, isLocal) {
        if (!isOnCreate && !isLocal) {
            return false;
        } else {
            return true;
        }
    }

    static _isMainWorkCenterEditable(control, isOnCreate, isLocal) {
        let assignmentType = libCommon.getWorkOrderAssignmentType(control.getPageProxy());
        if (assignmentType === 8) {
            return false;
        } else if (!isOnCreate && !isLocal) {
            return false;
        } else {
            return true;
        }
    }

    static _isPlanningPlantEditable(isOnCreate, isLocal) {
        if (!isOnCreate && !isLocal) {
            return false;
        } else {
            return true;
        }
    }

    static _isFunctionalLocationEditable(isOnCreate, isLocal) {
        if (!isOnCreate && !isLocal) {
            return false;
        } else {
            return true;
        }
    }

    static _isEquipmentEditable(isOnCreate, isLocal) {
        if (!isOnCreate && !isLocal) {
            return false;
        } else {
            return true;
        }
    }

    static _isOrderTypeEditable(isOnCreate, isLocal) {
        if (!isOnCreate && !isLocal) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * return Note visibility based on isOnCreate;
     *
     * @static
     * @param {boolean} isOnCreate
     * @returns {boolean}
     *
     * @memberof PrivateMethodsLibrary
     */
    static _shouldNoteVisible(isOnCreate) {
        return isOnCreate;
    }

    /**
     * return MarkedJob Switch visibility
     *
     * @static
     * @param {boolean} isOnCreate
     * @returns {boolean}
     *
     * @memberof PrivateMethodsLibrary
     */
    static _shouldMarkedJobSwitchVisible(isOnCreate) {
        return !isOnCreate;
    }

    /**
     * Returns the PriorityType query based on order type and planning plant lookups.
     * @param {*} controlProxy Context page that holds the work order binding object.
     * @param {boolean} onCreate True if we are creating a new work order. False if we are editing an existing one.
     * @returns {String}
     */
    static _prioritySeg(controlProxy, onCreate) {
        let onFollowUp = libWo.getFollowUpFlag(controlProxy);
        let woOrderType = (onCreate && !onFollowUp) ? libCommon.getAppParam(controlProxy, 'WORKORDER', 'OrderType') : libCommon.getTargetPathValue(controlProxy, '#Property:OrderType');
        let planningPlant = '';
        if (onCreate) {
            planningPlant = libWoControls.getPlanningPlant(controlProxy.getPageProxy());
            if (!planningPlant) {
                planningPlant = libCommon.getStateVariable(controlProxy, 'WODefaultPlanningPlant');
            }
            if (!planningPlant) {
                planningPlant = assnType.getWorkOrderFieldDefault('WorkOrderHeader', 'PlanningPlant');
            }
        } else {
            planningPlant = libCommon.getTargetPathValue(controlProxy, '#Property:PlanningPlant');
        }
        return controlProxy.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], `$filter=OrderType eq '${woOrderType}' and PlanningPlant eq '${planningPlant}'`).then(function(myOrderTypes) {
            let priorityType = '';
            if (myOrderTypes && myOrderTypes.length > 0) {
                priorityType = myOrderTypes.getItem(0).PriorityType;
            }
            if (priorityType) {
                return "$filter=PriorityType eq '" + priorityType + "'&$orderby=Priority";
            } else {
                return '$orderby=Priority';
            }
        });
    }
}
