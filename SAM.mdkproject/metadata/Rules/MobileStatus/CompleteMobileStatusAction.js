
import MobileStatusAction from './MobileStatusAction';
import libCommon from '../Common/Library/CommonLibrary';
import libEval from '../Common/Library/ValidationLibrary';
import libMobile from './MobileStatusLibrary';
import libClock from '../ClockInClockOut/ClockInClockOutLibrary';
import libSuper from '../Supervisor/SupervisorLibrary';
import ODataDate from '../Common/Date/ODataDate';
import mobileStatusEAMObjectType from './MobileStatusEAMObjectType';

import GenerateOffsetConfirmationNum from '../Confirmations/BlankFinal/GenerateOffsetConfirmationNum';
import GenerateConfirmationCounter from '../Confirmations/CreateUpdate/OnCommit/GenerateConfirmationCounter';
import FinalConfirmationOrderID from '../Confirmations/BlankFinal/FinalConfirmationOrderID';
import FinalConfirmationOperation from '../Confirmations/BlankFinal/FinalConfirmationOperation';
import FinalConfirmationSubOperation from '../Confirmations/BlankFinal/FinalConfirmationSubOperation';
import FinalConfirmation from '../Confirmations/BlankFinal/FinalConfirmation';
import ConfirmationCreateBlankReadLink from '../Confirmations/BlankFinal/ConfirmationCreateBlankReadLink';
import mobileStatusHistoryEntryCreate from './MobileStatusHistoryEntryCreate';
export default class CompleteMobileStatusAction extends MobileStatusAction {

    getDefaultArgs() {
        let defaultArgs = super.getDefaultArgs();
        defaultArgs.didCreateFinalConfirmation = false;
        return defaultArgs;
    }

    /**
     * This should be overwritten by the class that extends this class.
     * That class needs to set the following values in client data: FinalConfirmationOrderID, FinalConfirmationOperation, FinalConfirmationSubOperation.
     * If there is no FinalConfirmationSubOperation, then its value should be blank but you still need to add FinalConfirmationSubOperation to client data.
     * All these client data values are used in ConfirmationCreateBlank.action.
     */
    didSetFinalConfirmationParams() {
        return false;
    }

    /**
     * context.binding is going to be one of the following objects: MyWorkOrderHeader, MyWorkOrderOperation, MyWorkOrderSubOperation, or mConfirmation.
     * This method is called multiple times from the same context to set the mobile status to complete for various object that are not always the same as
     * the context.binding object. For example, if context.binding is MyWorkOrderOperation, then this function is first called to set the operation
     * mobile status to complete. Next, it's called again to set the mobile status of the parent object of MyWorkOrderOperation,
     * which is MyWorkOrderHeader, to complete.
     *
     * @param {*} context PageProxy or action that contains a binding object.
     * @param {*} instance This is the object for which we want to set the mobile status to "complete".
     *              contest.binding can be MyWorkOrderOperation and instance can be MyWorkOrderHeaders.
     */
    setMobileStatusComplete(context, instance, binding) {
        //Binding object should be either a MyWorkOrderHeader, MyWorkOrderOperation, or MyWorkOrderSubOperation.
        let bindingObj = binding || libCommon.getBindingObject(context);
        if (!libCommon.isDefined(bindingObj)) {
            bindingObj = context.getClientData().currentObject;
        }
        let mobileStatusObject = '';

        /**
         * Set the correct bindingObj here.
         * If you create a labor PM confirmation from ConfirmationsOverviewListView.page, the bindingObj will be mConfirmation.
         * mConfirmation is our madeup object which we shouldn't be using but it's too complex to break now.
         * mConfirmation contains MyWorkOrderHeader inside it, in a property called WorkOrderHeader.
         * Here we are just setting bindingObj to be MyWorkOrderHeader from mConfirmation.WorkOrderHeader.
         */
        if (bindingObj.hasOwnProperty('name') && bindingObj.name === 'mConfirmation') {
            bindingObj = libMobile.getWorkOrderHeaderObjFromConfirmationObj(context);
        }

        //This is the object for which we want to update the mobile status to "complete".
        let mobileInstance = '';

        if (bindingObj) {
            switch (instance.entitySet()) {
                case 'MyWorkOrderHeaders': {
                    switch (bindingObj['@odata.type']) {
                        case '#sap_mobile.MyWorkOrderHeader': {
                            mobileStatusObject = bindingObj.OrderMobileStatus_Nav;
                            mobileInstance = bindingObj;
                            break;
                        }
                        case '#sap_mobile.MyWorkOrderOperation': {
                            mobileStatusObject = bindingObj.WOHeader.OrderMobileStatus_Nav;
                            mobileInstance = bindingObj.WOHeader;
                            break;
                        }
                        case '#sap_mobile.MyWorkOrderSubOperation': {
                            mobileStatusObject = bindingObj.WorkOrderOperation.WOHeader.OrderMobileStatus_Nav;
                            mobileInstance = bindingObj.WorkOrderOperation.WOHeader;
                            break;
                        }
                        default:
                            break;
                    }
                    break;
                }
                case 'MyWorkOrderOperations': {
                    switch (bindingObj['@odata.type']) {
                        case '#sap_mobile.MyWorkOrderOperation': {
                            mobileStatusObject = bindingObj.OperationMobileStatus_Nav;
                            mobileInstance = bindingObj;
                            break;
                        }
                        case '#sap_mobile.MyWorkOrderSubOperation': {
                            mobileStatusObject = bindingObj.WorkOrderOperation.OperationMobileStatus_Nav;
                            mobileInstance = bindingObj.WorkOrderOperation;
                            break;
                        }
                        default:
                            break;
                    }
                    break;
                }
                case 'MyWorkOrderSubOperations': {
                    switch (bindingObj['@odata.type']) {
                        case '#sap_mobile.MyWorkOrderSubOperation': {
                            mobileStatusObject = bindingObj.SubOpMobileStatus_Nav;
                            mobileInstance = bindingObj;
                            break;
                        }
                        default:
                            break;
                    }
                    break;
                }
                default:
                    break;
            }
        }

        if (libCommon.isDefined(mobileStatusObject)) {
            //Needed for MobileStatusSetComplete.action.
            context.getClientData().MobileStatusReadLink = mobileStatusObject['@odata.readLink'];
            context.getClientData().MobileStatusObjectKey = mobileStatusObject.ObjectKey;
            context.getClientData().MobileStatusObjectType = mobileStatusObject.ObjectType;
            //Needed for EndDateTime.js which is called in MobileStatusSetComplete.action.
            context.getClientData().MobileStatusInstance = mobileInstance;

            //Fix for 12508 - JCL
            if (mobileInstance) {
                mobileInstance.MobileStatusReadLink = mobileStatusObject['@odata.readLink'] || mobileInstance['@odata.readLink'];
                mobileInstance.MobileStatusObjectKey = mobileStatusObject.ObjectKey || mobileInstance.ObjectKey;
                mobileInstance.MobileStatusObjectType = mobileStatusObject.ObjectType || mobileInstance.ObjectType;
            }

            /**
             * When we call this code from a context menu swipe on WO list page to complete an order, there is no previous page.
             * Running context.evaluateTargetPathForAPI('#Page:-Previous') will error out.
             * libCommon.getStateVariable(context, 'contextMenuSwipePage') will tell us if we are coming from a context menu swipe along with which page it is.
             */
            if (!libCommon.getStateVariable(context, 'contextMenuSwipePage')) {
                //Since we are closing the page in labor time, we need to save the instance for later.
                //I have no idea why we do this. We need more detailed comments here from the person who wrote this code.
                context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().currentInstance = instance;
            }
            if (!libEval.evalIsEmpty(context.getClientData().currentObject)) {
                context.getClientData().currentObject.currentInstance=context.getClientData().currentInstance;
            }
            let target = mobileInstance;
            if (!target) {
                target = bindingObj;
            }

            return libSuper.checkReviewRequired(context, target).then(review => {
                libMobile.rollupCompleteStatusToChildPages(context, target, review);
                return libClock.reloadUserTimeEntries(context, false, false, mobileInstance).then(() => {
                    return libClock.clockOutBusinessObject(context, mobileInstance).then(() => {
                        if (review) { //target requires review for technician user
                            return context.executeAction('/SAPAssetManager/Actions/Supervisor/MobileStatus/MobileStatusSetReview.action');
                        }
                        let odataDate = new ODataDate();
                        libCommon.setStateVariable(context, 'StatusEndDate', odataDate.date());
                        const completeMobileStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
                        const eamObjType = mobileStatusEAMObjectType(context);
                        const properties = {
                            'ObjectType': mobileInstance.MobileStatusObjectType,
                            'ObjectKey': mobileInstance.MobileStatusObjectKey,
                            'MobileStatus': completeMobileStatus,
                            'EffectiveTimestamp': odataDate.toDBDateTimeString(context),
                            'CreateUserGUID': libCommon.getUserGuid(context),
                            'CreateUserId': libCommon.getSapUserName(context),
                        };
                        return context.executeAction({'Name': '/SAPAssetManager/Actions/Confirmations/MobileStatusSetComplete.action', 'Properties': {
                            'Properties': properties,
                            'Target': {
                                'EntitySet': 'PMMobileStatuses',
                                'Service': '/SAPAssetManager/Services/AssetManager.service',
                                'ReadLink' : mobileInstance.MobileStatusReadLink,
                            },
                            'UpdateLinks': [{
                                'Property': 'OverallStatusCfg_Nav',
                                'Target': {
                                    'EntitySet': 'EAMOverallStatusConfigs',
                                    'QueryOptions': `$filter=MobileStatus eq '${completeMobileStatus}' and ObjectType eq '${eamObjType}'`,
                                },
                            }],
                        }}).then(() => {
                            return mobileStatusHistoryEntryCreate(context, properties, mobileInstance.MobileStatusReadLink).then(() => {
                                // Get rid of saved binding object
                                let clientData = context.getClientData();
                                if (clientData && clientData.currentObject) {
                                    delete clientData.currentObject;
                                }
                            });
                        });
                    });
                });
            });
        } else {
            if (bindingObj) {
                switch (bindingObj['@odata.type']) {
                    case '#sap_mobile.MyWorkOrderHeader': {
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusFailureMessage.action');
                    }
                    case '#sap_mobile.MyWorkOrderOperation': {
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusFailureMessage.action');
                    }
                    case '#sap_mobile.MyWorkOrderSubOperation': {
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusFailureMessage.action');
                    }
                    default:
                        break;
                }
            }
            return Promise.reject(false);
        }
    }

    executeCreateBlankConfirmationIfMissing(context, instance) {
        if (!instance.args.didCreateFinalConfirmation && instance.didSetFinalConfirmationParams(context)) {
            return libSuper.decideCreateBlankConfirmation(context, instance).then(create => {
                if (create) { //Ok to create confirmation, review is not required for this business object
                    // Execute the blank final confirmation create action
                    // Action override required to ensure context hasn't changed. Promises will not be resolved in time, hence Promise.all()
                    return Promise.all([GenerateOffsetConfirmationNum(context), GenerateConfirmationCounter(context)]).then(results => {
                        return context.executeAction({'Name': '/SAPAssetManager/Actions/Confirmations/ConfirmationCreateBlank.action', 'Properties': {
                            'Properties': {
                                'ConfirmationNum': results[0],
                                'ConfirmationCounter': results[1],
                                'FinalConfirmation': FinalConfirmation(context),
                                'OrderID': FinalConfirmationOrderID(context),
                                'Operation': FinalConfirmationOperation(context),
                                'SubOperation': FinalConfirmationSubOperation(context),
                                'StartDate': '/SAPAssetManager/Rules/Confirmations/BlankFinal/GetCurrentDate.js',
                                'StartTime': '/SAPAssetManager/Rules/Confirmations/BlankFinal/GetCurrentTime.js',
                                'FinishDate': '/SAPAssetManager/Rules/Confirmations/BlankFinal/GetCurrentDate.js',
                                'FinishTime': '/SAPAssetManager/Rules/Confirmations/BlankFinal/GetCurrentTime.js',
                                'PostingDate': '/SAPAssetManager/Rules/Confirmations/CreateUpdate/OnCommit/GetCreatedDate.js',
                                'CreatedDate': '/SAPAssetManager/Rules/Confirmations/CreateUpdate/OnCommit/GetCreatedDate.js',
                                'CreatedTime': '/SAPAssetManager/Rules/Confirmations/CreateUpdate/OnCommit/GetCreatedTime.js',
                            },
                            'CreateLinks': ConfirmationCreateBlankReadLink(context),
                        }});
                    });
                }
                return true;
            });
        }
        return Promise.resolve(true);
    }
}
