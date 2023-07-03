import libCommon from '../Common/Library/CommonLibrary';
import libEval from '../Common/Library/ValidationLibrary';
import QueryBuilder from '../Common/Query/QueryBuilder';
import MobileStatusCompleted from './MobileStatusCompleted';
import MobileStatusReview from './MobileStatusReview';
import FetchRequest from '../Common/Query/FetchRequest';
import libThis from './MobileStatusLibrary';
import IsPhaseModelEnabled from '../Common/IsPhaseModelEnabled';

export default class {

    static getObjectKey(context) {
        return libCommon.getTargetPathValue(context, '#Property:ObjectKey');
    }

    static getPageContext(context, page) {
        try {
            return context.evaluateTargetPathForAPI('#Page:' + page);
        } catch (exc) {
            return context;
        }
    }

    static isHeaderStatusChangeable(context) {
        var assignmentType = libCommon.getWorkOrderAssignmentType(context);
        switch (assignmentType) {
            case '1':
                return true;
            case '2':
                return false;
            case '3':
                return false;
            case '4':
                return false;
            case '5':
                return true;
            case '6':
                return false;
            case '7':
                return true;
            case '8':
                return true;
            case 'A':
                return false;
            default:
                return false;
        }
    }

    static isNotifHeaderStatusChangeable(context) {
        var assignmentType = libCommon.getNotificationAssignmentType(context);
        switch (assignmentType) {
            case '1':
                return true;
            case '2':
                return true;
            case '3':
                return true;
            case '4':
                return false;
            case '5':
                return true;
            case '6':
                return false;
            case '7':
                return false;
            case '8':
                return false;
            case 'A':
                return false;
            default:
                return false;
        }
    }

    static isOperationStatusChangeable(context) {
        var assignmentType = libCommon.getWorkOrderAssignmentType(context);
        switch (assignmentType) {
            case '1':
                return false;
            case '2':
                return true;
            case '3':
                return false;
            case '4':
                return true;
            case '5':
                return false;
            case '6':
                return true;
            case '7':
                return false;
            case '8':
                return false;
            case 'A':
                return true;
            default:
                return false;
        }
    }

    static isSubOperationStatusChangeable(context) {
        var assignmentType = libCommon.getWorkOrderAssignmentType(context);
        switch (assignmentType) {
            case '1':
                return false;
            case '2':
                return false;
            case '3':
                return true;
            case '4':
                return false;
            case '5':
                return false;
            case '6':
                return false;
            case '7':
                return false;
            case '8':
                return false;
            case 'A':
                return false;
            default:
                return false;
        }
    }

    static setStartStatus(context) {
        var clientData = context.getClientData();
        clientData.ChangeStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        this.setMobileStatus(libCommon.getBindingObject(context), clientData.ChangeStatus, libCommon.getUserGuid(context), libCommon.getSapUserName(context));
    }

    static setHoldStatus(context) {
        var clientData = context.getClientData();
        clientData.ChangeStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
        this.setMobileStatus(libCommon.getBindingObject(context), clientData.ChangeStatus, libCommon.getUserGuid(context), libCommon.getSapUserName(context));
    }

    static setAcceptedStatus(context) {
        var clientData = context.getClientData();
        clientData.ChangeStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/AcceptedParameterName.global').getValue());
        this.setMobileStatus(libCommon.getBindingObject(context), clientData.ChangeStatus, libCommon.getUserGuid(context), libCommon.getSapUserName(context));
    }

    static setTravelStatus(context) {
        var clientData = context.getClientData();
        clientData.ChangeStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TravelParameterName.global').getValue());
        this.setMobileStatus(libCommon.getBindingObject(context), clientData.ChangeStatus, libCommon.getUserGuid(context), libCommon.getSapUserName(context));
    }

    static setOnsiteStatus(context) {
        var clientData = context.getClientData();
        clientData.ChangeStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/OnsiteParameterName.global').getValue());
        this.setMobileStatus(libCommon.getBindingObject(context), clientData.ChangeStatus, libCommon.getUserGuid(context), libCommon.getSapUserName(context));
    }

    static setTransferStatus(context) {
        var clientData = context.getClientData();
        clientData.ChangeStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
        this.setMobileStatus(context.binding, clientData.ChangeStatus, libCommon.getUserGuid(context), libCommon.getSapUserName(context));
    }

    static setCompleteStatus(context) {
        var clientData = context.getClientData();
        clientData.ChangeStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        this.setMobileStatus(libCommon.getBindingObject(context), clientData.ChangeStatus, libCommon.getUserGuid(context), libCommon.getSapUserName(context));
    }

    static setSuccessStatus(context) {
        var clientData = context.getClientData();
        clientData.ChangeStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/SuccessParameterName.global').getValue());
        this.setMobileStatus(context.binding, clientData.ChangeStatus, libCommon.getUserGuid(context), libCommon.getSapUserName(context));
    }

    static setReviewStatus(context) {
        var clientData = context.getClientData();
        clientData.ChangeStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
        this.setMobileStatus(libCommon.getBindingObject(context), clientData.ChangeStatus, libCommon.getUserGuid(context), libCommon.getSapUserName(context));
    }

    static setRejectedStatus(context) {
        var clientData = context.getClientData();
        clientData.ChangeStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());
        this.setMobileStatus(context.binding, clientData.ChangeStatus, libCommon.getUserGuid(context), libCommon.getSapUserName(context));
    }

    /**
     * Phase model generic status handler
     * @param {*} context 
     * @param {*} status 
     */
    static setGenericStatus(context, status) {
        var clientData = context.getClientData();
        clientData.ChangeStatus = status;
        this.setMobileStatus(context.binding, clientData.ChangeStatus, libCommon.getUserGuid(context), libCommon.getSapUserName(context));
    }

    /**
     * Status has changed due to phase model update, so refresh the binding
     * @param {*} context 
     * @param {*} status 
     */
    static phaseModelStatusChange(context, status) {
        switch (status) {
            case 'COMPLETED':
                return this.setCompleteStatus(context);
            case 'HOLD':
                return this.setHoldStatus(context);
            case 'REJECTED':
                return this.setRejectedStatus(context);
            case 'REVIEW':
                return this.setReviewStatus(context);
            case 'STARTED':
                return this.setStartStatus(context);
            case 'SUCCESS':
                return this.setSuccessStatus(context);
            case 'TRANSFER':
                return this.setTransferStatus(context);
            default:
                return this.setGenericStatus(context, status);
        }
    }

    static refreshPage(context) {
        if (context) {
            if (context.getControls()) {
                var controls = context.getControls();
                for (var i = 0; i < controls.length; i++) {
                    this.redraw(controls[i]);
                }
            }
        }
    }

    static refreshPreviousPage(context, page) {
        let pageProxy = context.evaluateTargetPathForAPI('#Page:' + page);
        this.refreshPage(pageProxy);
    }

    static redraw(control) {
        control.redraw();
    }

    static showWarningMessage(context, messageText, captionText = context.localizeText('confirm_status_change'), okButtonText = context.localizeText('ok'), cancelButtonText = context.localizeText('cancel')) {
        context.dismissActivityIndicator();
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
            'Properties': {
                'Title': captionText,
                'Message': messageText,
                'OKCaption': okButtonText,
                'CancelCaption': cancelButtonText,
            },
        }).then(result => {
            return result.data;
        });
    }

    static markedJobsListMobileStatus(context, binding) {
        let currentReadLink = binding.WorkOrderHeader['@odata.readLink'];
        let isLocal = libCommon.isCurrentReadLinkLocal(currentReadLink);
        var status = '';
        if (!isLocal) {
            if (binding && binding.WorkOrderHeader && binding.WorkOrderHeader.OrderMobileStatus_Nav.MobileStatus) {
                status = binding.WorkOrderHeader.OrderMobileStatus_Nav.MobileStatus;
            } else if (binding && binding.WorkOrderHeader && binding.WorkOrderHeader.MobileStatus) {
                status = binding.WorkOrderHeader.MobileStatus;
            }
        } else {
            status = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
        }
        return status;
    }

    /**
     * Gets the mobile status as a Promise.
     * @deprecated Use new function called {@link getMobileStatus}
     * @param {*} context
     * @param {*} binding
     */
    static mobileStatus(context, binding) {
        var status = this.getMobileStatus(binding, context);
        if (context.binding) {
            return Promise.resolve(status);
        }
        return Promise.resolve(status);
    }

    /**
     * Gets the mobile status value of the context binding object.
     *
     * @param {*} binding context.binding object
     */
    static getMobileStatus(binding, context) {
        const STARTED = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        const COMPLETED = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());

        if (binding) {
            binding.clockMobileUserGUID = ''; //Handle clock in/out support
            binding.ClockSapUserName = ''; //Use SAP User Name instead of GUID
            binding.supervisorLocal = false;
            switch (binding['@odata.type']) {
                case '#sap_mobile.MyWorkOrderHeader':
                    if (binding.OrderMobileStatus_Nav.MobileStatus) {
                        if (binding.OrderMobileStatus_Nav.CreateUserGUID) {
                            binding.clockMobileUserGUID = binding.OrderMobileStatus_Nav.CreateUserGUID;
                            binding.ClockSapUserName = binding.OrderMobileStatus_Nav.CreateUserId;
                        }
                        binding.supervisorLocal = binding.OrderMobileStatus_Nav['@sap.isLocal'];
                        return binding.OrderMobileStatus_Nav.MobileStatus;
                    }
                    break;
                case '#sap_mobile.MyWorkOrderOperation':
                    if (binding.OperationMobileStatus_Nav.MobileStatus) {
                        if (binding.OperationMobileStatus_Nav.CreateUserGUID) {
                            binding.clockMobileUserGUID = binding.OperationMobileStatus_Nav.CreateUserGUID;
                            binding.ClockSapUserName = binding.OperationMobileStatus_Nav.CreateUserId;
                        }
                        binding.supervisorLocal = binding.OperationMobileStatus_Nav['@sap.isLocal'];
                        return binding.OperationMobileStatus_Nav.MobileStatus;
                    }
                    break;
                case '#sap_mobile.MyWorkOrderSubOperation':
                    if (binding.SubOpMobileStatus_Nav.MobileStatus) {
                        if (binding.SubOpMobileStatus_Nav.CreateUserGUID) {
                            binding.clockMobileUserGUID = binding.SubOpMobileStatus_Nav.CreateUserGUID;
                            binding.ClockSapUserName = binding.SubOpMobileStatus_Nav.CreateUserId;
                        }
                        return binding.SubOpMobileStatus_Nav.MobileStatus;
                    }
                    break;
                case '#sap_mobile.MyNotificationHeader':
                        //Need to account for some backend behavior that we no control over:
                        //When we create a minor notif, we intentionally don't create a link to OverallStatusCfg_Nav (and grab the mobile status from NotifMobileStatus_Nav)
                        //However, after syncing backend creates a link to OverallStatusCfg_Nav for the SUBMITTED status
                        //Once we create a notif we have no record of whether it was minor or not. So we will check for started in NotifMobileStatus_Nav first

                        if (binding.NotifMobileStatus_Nav) {
                            if (IsPhaseModelEnabled(context) && (binding.NotifMobileStatus_Nav.MobileStatus === STARTED || binding.NotifMobileStatus_Nav.MobileStatus === COMPLETED)) {
                                return binding.NotifMobileStatus_Nav.MobileStatus;
                            }

                            if (!libEval.evalIsEmpty(binding.NotifMobileStatus_Nav.OverallStatusCfg_Nav)) {
                                return binding.NotifMobileStatus_Nav.OverallStatusCfg_Nav.MobileStatus;
                            } 
                            return binding.NotifMobileStatus_Nav.MobileStatus;
                        }
                        return '';
                case '#sap_mobile.MyNotificationTask':
                        if (binding.TaskMobileStatus_Nav.MobileStatus) {
                            return binding.TaskMobileStatus_Nav.MobileStatus;
                        }
                        break;
                case '#sap_mobile.MyNotificationItemTask':
                        if (binding.ItemTaskMobileStatus_Nav.MobileStatus) {
                            return binding.ItemTaskMobileStatus_Nav.MobileStatus;
                        }
                        break;
                default:
                    if (binding.MobileStatus) {
                        if (binding.MobileStatus.CreateUserGUID) {
                            binding.clockMobileUserGUID = binding.MobileStatus.CreateUserGUID;
                            binding.ClockSapUserName = binding.MobileStatus.CreateUserId;
                        }
                        return binding.MobileStatus.MobileStatus;
                    }
            }
        }
        return '';
    }

    /**
     * Sets the mobile status of the current context binding object.
     * @param {*} binding
     * @param {*} mobileStatus
     * @param {*} userGUID - GUID for the user making the status change
     */
    static setMobileStatus(binding, mobileStatus, userGUID, userId) {
        if (binding && mobileStatus && (mobileStatus !== '')) {
            switch (binding['@odata.type']) {
                case '#sap_mobile.MyWorkOrderHeader': {
                    binding.OrderMobileStatus_Nav.MobileStatus = mobileStatus;
                    binding.OrderMobileStatus_Nav.CreateUserGUID = userGUID;
                    binding.OrderMobileStatus_Nav.CreateUserId = userId;                        
                    break;
                }
                case '#sap_mobile.MyWorkOrderOperation': {
                    binding.OperationMobileStatus_Nav.MobileStatus = mobileStatus;
                    binding.OperationMobileStatus_Nav.CreateUserGUID = userGUID;
                    binding.OperationMobileStatus_Nav.CreateUserId = userId; 
                    break;
                }
                case '#sap_mobile.MyWorkOrderSubOperation': {
                    binding.SubOpMobileStatus_Nav.MobileStatus = mobileStatus;
                    binding.SubOpMobileStatus_Nav.CreateUserGUID = userGUID;
                    binding.SubOpMobileStatus_Nav.CreateUserId = userId;
                    break;
                }
                case '#sap_mobile.MyNotificationHeader': {
                    binding.NotifMobileStatus_Nav.MobileStatus = mobileStatus;
                    binding.NotifMobileStatus_Nav.CreateUserGUID = userGUID;
                    binding.NotifMobileStatus_Nav.CreateUserId = userId;
                    break;
                }
                case '#sap_mobile.MyNotificationTask': {
                    binding.TaskMobileStatus_Nav.MobileStatus = mobileStatus;
                    binding.TaskMobileStatus_Nav.CreateUserGUID = userGUID;
                    binding.TaskMobileStatus_Nav.CreateUserId = userId;
                    break;
                }
                case '#sap_mobile.MyNotificationItemTask': {
                    binding.ItemTaskMobileStatus_Nav.MobileStatus = mobileStatus;
                    binding.ItemTaskMobileStatus_Nav.CreateUserGUID = userGUID;
                    binding.ItemTaskMobileStatus_Nav.CreateUserId = userId;
                    break;
                }
                default:
            }
        }
    }

    static isMobileStatusConfirmed(context, SubOperation = '') {

        let binding = context.getBindingObject();

        let orderId = binding.OrderId ? binding.OrderId : binding.OrderID;
        let operation = binding.OperationNo ? binding.OperationNo : binding.Operation;

        if (orderId && operation) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'Confirmations', [], `$filter=OrderID eq '${orderId}' and Operation eq '${operation}' and SubOperation eq '${SubOperation}'&$orderby=ConfirmationCounter desc&$top=1`).then(result => {
                if (result && result.length > 0) {
                    let confirmation = result.getItem(0);
                    if (confirmation && confirmation.FinalConfirmation) {
                        return confirmation.FinalConfirmation === 'X';
                    }
                }
                return false;
            });
        } else {
            return Promise.resolve(false);
        }

    }

    static getQueryOptionsForCompletedStatusForOperations(context, orderId) {
        let binding = context.getBindingObject();
        let queryBuilder = new QueryBuilder();

        queryBuilder.addFilter(`OrderId eq '${orderId}'`);
        queryBuilder.addAllSelectStatements(['OperationNo', 'OperationShortText']);
        queryBuilder.addExtra('orderby=OperationNo');

        if (this.isOperationStatusChangeable(context)) {
            queryBuilder.addExpandStatement('OperationMobileStatus_Nav');
            if (!libEval.evalIsEmpty(binding.Operation)) {
                queryBuilder.addFilter(`OperationNo eq '${binding.Operation}'`);
            } else {
                queryBuilder.addFilter(`OperationMobileStatus_Nav/MobileStatus ne '${MobileStatusCompleted(context)}'`);
            }
            return queryBuilder.build();
        } else { //Header level assignment type so need to check for confirmed status
            return this.getAllConfirmationsForWorkorderForOperation(context, orderId).then(allConfirmations => {
                let grouped = this.groupByOperation(allConfirmations, confirmation => confirmation.Operation);
                let iterator1 = grouped[Symbol.iterator]();

                for (let [key, value] of iterator1) {
                    if (value.FinalConfirmation === 'X') {
                        if (binding.Operation === key) { //During confirmation edit we do not want to exclude the current operation
                            queryBuilder.addFilter(`OperationNo eq '${key}'`);
                        }
                    }
                }
                return queryBuilder.build();
            });
        }
    }

    static getStatusForOperations(context, orderId) {
        let queryBuilder = new QueryBuilder();

        queryBuilder.addFilter(`OrderId eq '${orderId}'`);

        return this.getAllConfirmationsForWorkorderForOperation(context, orderId).then(allConfirmations => {
            let grouped = this.groupByOperation(allConfirmations, confirmation => confirmation.Operation);
            let iterator1 = grouped[Symbol.iterator]();

            for (let [key, value] of iterator1) {
                if (value.FinalConfirmation === 'X') {
                    queryBuilder.addFilter(`OperationNo ne '${key}'`);
                }
            }
            return queryBuilder.build();
        });
    }

    static getQueryOptionsForCompletedStatusForSuboperations(context, orderId, operation) {
        let binding = context.binding;
        let queryBuilder = new QueryBuilder();

        queryBuilder.addFilter(`OrderId eq '${orderId}'`);
        queryBuilder.addFilter(`OperationNo eq '${operation}'`);
        queryBuilder.addExtra('orderby=SubOperationNo');

        if (this.isSubOperationStatusChangeable(context)) { //check for subop completed status
            queryBuilder.addExpandStatement('SubOpMobileStatus_Nav');
            if (!libEval.evalIsEmpty(binding.SubOperation)) {
                queryBuilder.addFilter(`SubOperationNo eq '${binding.SubOperation}'`);
            } else {
                queryBuilder.addFilter(`SubOpMobileStatus_Nav/MobileStatus ne '${MobileStatusCompleted(context)}'`);
            }
            return new Promise((resolve, reject) => {
                try {
                    return resolve(queryBuilder.build());
                } catch (error) {
                    return reject('');
                }
            });
        } else { // check for confirmed status of suboperations
            return this.getAllConfirmationsForWorkorderForSubOperation(context, orderId, operation).then(allConfirmations => {
                let grouped = this.groupByOperation(allConfirmations, confirmation => confirmation.SubOperation);
                let iterator1 = grouped[Symbol.iterator]();

                for (let [key, value] of iterator1) {
                    if (value.FinalConfirmation === 'X') {
                        if (binding.SubOperation === key) { //During confirmation edit we do not want to exclude the current suboperation
                            queryBuilder.addFilter(`SubOperationNo eq '${key}'`);
                        }
                    }
                }
                return queryBuilder.build();
            });
        }

    }

    static getStatusForSubOperations(context, orderId, operationNo) {
        let queryBuilder = new QueryBuilder();

        queryBuilder.addFilter(`OrderId eq '${orderId}'`);
        queryBuilder.addFilter(`OperationNo eq '${operationNo}'`);

        return this.getAllConfirmationsForWorkorderForSubOperation(context, orderId, operationNo).then(allConfirmations => {
            let grouped = this.groupByOperation(allConfirmations, confirmation => confirmation.SubOperation);
            let iterator1 = grouped[Symbol.iterator]();

            for (let [key, value] of iterator1) {
                if (value.FinalConfirmation === 'X') {
                    queryBuilder.addFilter(`SubOperationNo ne '${key}'`);
                }
            }
            return queryBuilder.build();
        });
    }

    static groupByOperation(confirmations, keyProperty) {
        let map = new Map();
        confirmations.forEach((confirmation) => {
            let operationNo = keyProperty(confirmation);
            let existingConfirmation = map.get(operationNo);
            if (!existingConfirmation) { //no confirmation exist for this operation so add it
                map.set(operationNo, confirmation);
            } else { //multiple confirmations for this operation
                let counter = parseInt(confirmation.ConfirmationCounter);
                let existingCounter = parseInt(existingConfirmation.ConfirmationCounter);
                if (counter > existingCounter) {
                    map.set(operationNo, confirmation);
                }
            }
        });
        return map;
    }

    static getAllConfirmationsForWorkorderForOperation(context, orderId) {
        let queryBuilder = new QueryBuilder();
        queryBuilder.addFilter(`OrderID eq '${orderId}'`);
        queryBuilder.addFilter("SubOperation eq ''");

        let request = new FetchRequest('Confirmations', queryBuilder.build());

        return request.execute(context).then(result => {
            let confirmations = [];
            result.forEach(item => {
                confirmations.push(item);
            });
            return confirmations;
        });
    }

    static getAllConfirmationsForWorkorderForSubOperation(context, orderId, operationNo) {
        let queryBuilder = new QueryBuilder();
        queryBuilder.addFilter(`OrderID eq '${orderId}'`);
        queryBuilder.addFilter(`Operation eq '${operationNo}'`);
        queryBuilder.addFilter("SubOperation ne ''");

        let request = new FetchRequest('Confirmations', queryBuilder.build());

        return request.execute(context).then(result => {
            let confirmations = [];
            result.forEach(item => {
                confirmations.push(item);
            });
            return confirmations;
        });
    }

    /**
     *
     * @param {*} context
     * @param {*} entitySet
     * @param {*} orderId
     * @param {*} operation
     * @param {*} review - Allow checking for review status also
     */
    static isMobileStatusComplete(context, entitySet, orderId, operation, review=false) {
        let queryBuilder = new QueryBuilder();

        queryBuilder.addFilter(`OrderId eq '${orderId}'`);

        if (operation) { //Operation level assignment
            queryBuilder.addFilter(`OperationNo eq '${operation}'`);
            queryBuilder.addExpandStatement('OperationMobileStatus_Nav');
        } else { //Header level assignment
            queryBuilder.addExpandStatement('OrderMobileStatus_Nav');
        }

        let fetchRequest = new FetchRequest(entitySet, queryBuilder.build());

        return fetchRequest.execute(context).then(result => {
            let object = result.getItem(0);
            if (operation) {
                if (object.OperationMobileStatus_Nav.MobileStatus === MobileStatusCompleted(context)) {
                    return true;
                }
                if (review) {
                    if (object.OperationMobileStatus_Nav.MobileStatus === MobileStatusReview(context)) {
                        return true;
                    }
                }
            } else {
                if (object.OrderMobileStatus_Nav.MobileStatus === MobileStatusCompleted(context)) {
                    return true;
                }
                if (review) {
                    if (object.OrderMobileStatus_Nav.MobileStatus === MobileStatusReview(context)) {
                        return true;
                    }
                }
            }
            return false;
        });
    }

    /**
     * We create our own Confirmation object called mConfirmation in ConfirmationCreateUpdateNav.js
     * instead of creating it from an actual EntitySet. mConfirmation is then assigned to the action
     * context's binding property. Thus, it becomes our new binding object. We shouldn't be creating
     * this mConfirmation object to begin with, but the Confirmation code is too complex to refactor
     * in the short time that we have right now.
     *
     * This function is to get the WorkOrderHeader object which does come from an EntitySet from the mConfirmation object.
     * If no WorkOrderHeader object is found then it returns undefined.
     *
     * @param {*} context The PageProxy or Action context.
     */
    static getWorkOrderHeaderObjFromConfirmationObj(context) {
        let bindingObj = context.binding;
        if (bindingObj.hasOwnProperty('name')) {
            if (bindingObj.name === 'mConfirmation') {
                if (bindingObj.hasOwnProperty('WorkOrderHeader')) {
                    bindingObj = bindingObj.WorkOrderHeader;
                    return bindingObj;
                }
            }
        }
        return undefined;
    }

    /**
     * Rollup code is completing a parent work order, operation or sub-operation, so update this complete status on the detail pages that reference this parent
     * @param {*} context
     * @param {*} parent
     * @param {*} review - Are we setting to review status instead of complete?
     */
    static rollupCompleteStatusToChildPages(context, parent, review) {

        let page;
        let pageContext;
        let status = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        if (review) {
            status = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
        }

        switch (parent['@odata.type']) {
            case '#sap_mobile.MyWorkOrderHeader': {
                page = '#Page:WorkOrderDetailsPage';
                try {
                    pageContext = context.evaluateTargetPathForAPI(page);
                } catch (err) {
                    //page does not exist
                }
                if (pageContext) {
                    libThis.setMobileStatus(pageContext.getBindingObject(), status, libCommon.getUserGuid(context), libCommon.getSapUserName(context));
                }
                page = '#Page:WorkOrderOperationDetailsPage';
                pageContext = '';
                try {
                    pageContext = context.evaluateTargetPathForAPI(page);
                } catch (err) {
                    //page does not exist
                }
                if (pageContext) {
                    libThis.setMobileStatus(pageContext.getBindingObject().WOHeader, status, libCommon.getUserGuid(context), libCommon.getSapUserName(context));
                }
                page = '#Page:SubOperationDetailsPage';
                pageContext = '';
                try {
                    pageContext = context.evaluateTargetPathForAPI(page);
                } catch (err) {
                    //page does not exist
                }
                if (pageContext) {
                    libThis.setMobileStatus(pageContext.getBindingObject().WorkOrderOperation.WOHeader, status, libCommon.getUserGuid(context), libCommon.getSapUserName(context));
                }
                break;
            }
            case '#sap_mobile.MyWorkOrderOperation': {
                page = '#Page:WorkOrderOperationDetailsPage';
                try {
                    pageContext = context.evaluateTargetPathForAPI(page);
                } catch (err) {
                    //page does not exist
                }
                if (pageContext) {
                    libThis.setMobileStatus(pageContext.getBindingObject(), status, libCommon.getUserGuid(context), libCommon.getSapUserName(context));
                }
                page = '#Page:SubOperationDetailsPage';
                pageContext = '';
                try {
                    pageContext = context.evaluateTargetPathForAPI(page);
                } catch (err) {
                    //page does not exist
                }
                if (pageContext) {
                    libThis.setMobileStatus(pageContext.getBindingObject().WorkOrderOperation, status, libCommon.getUserGuid(context), libCommon.getSapUserName(context));
                }
                break;
            }
            case '#sap_mobile.MyWorkOrderSubOperation': {
                page = '#Page:SubOperationDetailsPage';
                try {
                    pageContext = context.evaluateTargetPathForAPI(page);
                } catch (err) {
                    //page does not exist
                }
                if (pageContext) {
                    libThis.setMobileStatus(pageContext.getBindingObject(), status, libCommon.getUserGuid(context), libCommon.getSapUserName(context));
                }
                break;
            }
        }
    }

    static NotificationUpdateMalfunctionEnd(context, binding) {
        // Get the work order header object, since that's where the Notification resides
        let woBinding = (() => {
            try {
                switch (binding['@odata.type']) {
                    case '#sap_mobile.MyWorkOrderHeader':
                        return binding;
                    case '#sap_mobile.MyWorkOrderOperation':
                        return binding.WOHeader;
                    case '#sap_mobile.MyWorkOrderSubOperation':
                        return binding.WorkOrderOperation.WOHeader;
                    default:
                        return binding;
                }
            } catch (exc) {
                return binding;
            }
        })();
    
        if (woBinding.NotificationNumber) {
    
            let readLink = woBinding['@odata.readLink'] + '/NotifHeader_Nav';
            return context.read('/SAPAssetManager/Services/AssetManager.service', readLink, [], '$expand=NotifMobileStatus_Nav').then(results => {
                if (results && results.length > 0) {
                    let notif = results.getItem(0);
                    let complete = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
                    if (notif.BreakdownIndicator && notif.NotifMobileStatus_Nav.MobileStatus !== complete && !notif.MalfunctionEndDate) {  //Breakdown is set and end date is not set and notification is not already complete
                        let oldBinding = binding;
                        context.getPageProxy().setActionBinding(notif);
                        return context.getPageProxy().executeAction('/SAPAssetManager/Actions/Notifications/NotificationUpdateMalfunctionEndNav.action').then(() => {
                            context.getPageProxy().setActionBinding(oldBinding);
                            return Promise.resolve();
                        });
                    }
                }
                return Promise.resolve();
            });
        }
        return Promise.resolve();
    }

}
