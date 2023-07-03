import FetchRequest from '../../../Common/Query/FetchRequest';
import getDate from './GetDate';
import QueryBuilder from '../../../Common/Query/QueryBuilder';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { TransactionNoteType as TransactionNoteType } from '../../../Notes/NoteLibrary';
import {NoteLibrary as NoteLibrary} from '../../../Notes/NoteLibrary';
import GenerateLocalConfirmationNum from './GenerateLocalConfirmationNum';
import CascadingAction from '../../../Common/Action/CascadingAction';
import libMobile from '../../../MobileStatus/MobileStatusLibrary';
import libCommon from '../../../Common/Library/CommonLibrary';
import GenerateCounter from './GenerateConfirmationCounter';
import IsCompleteAction from '../../../WorkOrders/Complete/IsCompleteAction';
import CheckIsLam from '../../../Confirmations/CheckIsLam';
import WorkOrderCompletionLibrary from '../../../WorkOrders/Complete/WorkOrderCompletionLibrary';
import GetDuration from '../../../Confirmations/CreateUpdate/OnCommit/GetDuration';
import ConvertMinutesToHourString from '../../../Confirmations/ConvertMinutesToHourString';
import ExecuteActionWithAutoSync from '../../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';
import OperationCompleteFromWOListSwipe from '../../../WorkOrders/Operations/OperationCompleteFromWOListSwipe';
import SubOperationCompleteFromListSwipe from '../../../WorkOrders/SubOperations/SubOperationCompleteFromListSwipe';

export default class ConfirmationCreateUpdateAction extends CascadingAction {


    constructor(args) {
        super(args);

        if (!this.args.isFinalConfirmation) {
            // This is not a final confirmation
            // Return early
            return;
        }
        // This is a final confirmation
        let nextActionArgs = {
            doCheckWorkOrderComplete: this.args.doCheckWorkOrderComplete,
            WorkOrderId: this.args.WorkOrderId,
            OperationId: this.args.OperationId,
            didCreateFinalConfirmation: true,
        };

        if (this.args.SubOperationId !== undefined && this.args.doCheckSubOperationComplete) {
            nextActionArgs.SubOperationId = this.args.SubOperationId;
            nextActionArgs.doCheckOperationComplete = this.args.doCheckOperationComplete;
        }
    }

    getDefaultArgs() {
        return {
            isOnCreate: true,
            isFinalConfirmation: false,
            doCheckWorkOrderComplete: true,
            doCheckOperationComplete: true,
            doCheckSubOperationComplete: true,
        };
    }

    setActionQueue(actionQueue) {
        // Build the action queue at this point
        if (this.args.isOnCreate) {
            actionQueue.push(this.executeConfirmationCreate);
            actionQueue.push(this.executeCaptureDuration);
            actionQueue.push(this.executeNoteCreate);

        } else {
            actionQueue.push(this.executeConfirmationUpdate);
            actionQueue.push(this.executeCaptureDuration);
            actionQueue.push(this.executeNoteUpdate);
        }

        super.setActionQueue(actionQueue);
    }

    executeNoteCreate(context) {

        let note = CommonLibrary.getFieldValue(context, 'DescriptionNote', '', null, true);
        if (note) {
            //In order to handle note creation during the changeset action we need to keep a counter of the all the acitons for readlink purposes
            CommonLibrary.incrementChangeSetActionCounter(context);
            NoteLibrary.setNoteTypeTransactionFlag(context, TransactionNoteType.confirmation());
            return context.executeAction('/SAPAssetManager/Actions/Notes/NoteCreateDuringConfirmationCreate.action');
        }
        return Promise.resolve(true);
    }

    executeNoteUpdate(context) {
        let result = Promise.resolve(true);
        let note = CommonLibrary.getFieldValue(context, 'DescriptionNote', '', null, true);
        if (note) {
            NoteLibrary.setNoteTypeTransactionFlag(context, TransactionNoteType.confirmation());
            if (context.binding.LongText && !Array.isArray(context.binding.LongText)) { //A note already exists so, call the Update action
                result = context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateDuringConfirmationUpdate.action');
            } else {
                result = context.executeAction('/SAPAssetManager/Actions/Notes/NoteCreateDuringConfirmationUpdate.action');
            }
        } else if (context.binding.LongText && !Array.isArray(context.binding.LongText)) { //A note exists, but it's now being removed
            NoteLibrary.setNoteTypeTransactionFlag(context, TransactionNoteType.confirmation());
            result = context.executeAction('/SAPAssetManager/Actions/Notes/Delete/NoteDeleteDuringConfirmationUpdate.action');
        }
        return result.then(function() {
            return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessageNoClose.action');
        });
    }

    /**
     * Execute the Confirmation Create action
     * @param {*} context - Calling context
     */
    executeConfirmationCreate(context) {

        return GenerateLocalConfirmationNum(context).then(confirmationNum => {
            CommonLibrary.setStateVariable(context, 'LAMConfirmationNum',confirmationNum); //Save for adding LAM information after changeset
            return GenerateCounter(context).then(confirmationCounter => {
                CommonLibrary.setStateVariable(context, 'LAMConfirmationCounter', confirmationCounter);
                context.getClientData().localConfirmationNum = confirmationNum;
                return context.executeAction('/SAPAssetManager/Actions/Confirmations/ConfirmationCreate.action').then(result => {
                    if (IsCompleteAction(context)) {
                        WorkOrderCompletionLibrary.updateStepState(context, 'time', {
                            data: result.data,
                            link: JSON.parse(result.data)['@odata.editLink'],
                            value: ConvertMinutesToHourString(GetDuration(context)),
                            lam: '',
                        });

                        let confirmRow = JSON.parse(result.data);
                        return CheckIsLam(context, confirmRow).then((lamDefaultRow) => {
                            if (lamDefaultRow) {
                                WorkOrderCompletionLibrary.updateStepState(context, 'time', {
                                    lam: JSON.stringify(lamDefaultRow),
                                });
                            }
                            return Promise.resolve();
                        });
                    }
                    return Promise.resolve();
                });
            });
        });
    }

    /**
     * Execute the Confirmation Update action
     * @param {*} context
     */
    executeConfirmationUpdate(context) {
        return context.executeAction('/SAPAssetManager/Actions/Confirmations/ConfirmationUpdate.action').then(result => {
            if (IsCompleteAction(context)) {
                WorkOrderCompletionLibrary.updateStepState(context, 'time', {
                    data: result.data,
                    link: JSON.parse(result.data)['@odata.editLink'],
                    value: ConvertMinutesToHourString(GetDuration(context)),
                    lam: '',
                });

                let confirmRow = JSON.parse(result.data);
                return CheckIsLam(context, confirmRow).then((lamDefaultRow) => {
                    if (lamDefaultRow) {
                        WorkOrderCompletionLibrary.updateStepState(context, 'time', {
                            lam: JSON.stringify(lamDefaultRow),
                        });
                    }
                });
            }
            return Promise.resolve();
        });
    }

    /**
     * Create a new ConfirmationOverviewRow
     * @param {*} context
     */
    createConfirmationOverviewRow(context) {
        return context.executeAction('/SAPAssetManager/Actions/Confirmations/ConfirmationOverviewRowCreate.action');
    }

    /**
     * Capture the duration of the Confirmation
     * @param {*} context
     */
    executeCaptureDuration(context, instance) {
        let queryBuilder = new QueryBuilder();
        let postingDate = getDate(context);
        queryBuilder.addFilter(`PostingDate eq datetime'${postingDate}'`);
        queryBuilder.addExtra('top=1');
        let fetchRequest = new FetchRequest('ConfirmationOverviewRows', queryBuilder.build());
        // If the overview is not found, create a new one
        return fetchRequest.execute(context).then(result => {

            if (result === undefined || result.length === 0) {
                return instance.createConfirmationOverviewRow(context);
            } else {
                return Promise.resolve(true);
            }
        });
    }

    executeOperationComplete(context, instance) {
        if (instance.args.doCheckOperationComplete && instance.args.isFinalConfirmation && libMobile.isOperationStatusChangeable(context)) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderOperations(OrderId='${instance.args.WorkOrderId}',OperationNo='${instance.args.OperationId}')`, [], '$expand=OperationMobileStatus_Nav').then(function(result) {
                if (result && result.length > 0) {
                    let operation = result.getItem(0);
                    if (operation.OperationMobileStatus_Nav.MobileStatus !== libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue())) {
                        return OperationCompleteFromWOListSwipe(context, operation);
                    }
                    return Promise.resolve(false);  
                }
                return Promise.resolve(false);
            });
        }
        return Promise.resolve(false);
    }       

    executeSubOperationComplete(context, instance) {
        if (instance.args.doCheckSubOperationComplete && instance.args.SubOperationId && instance.args.isFinalConfirmation && libMobile.isSubOperationStatusChangeable(context)) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderSubOperations(OrderId='${instance.args.WorkOrderId}',OperationNo='${instance.args.OperationId}',SubOperationNo='${instance.args.SubOperationId}')`, [], '$expand=SubOpMobileStatus_Nav').then(function(result) {
                if (result && result.length > 0) {
                    let suboperation = result.getItem(0);
                    if (suboperation.SubOpMobileStatus_Nav.MobileStatus !== libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue())) {
                        return SubOperationCompleteFromListSwipe(context, suboperation);
                    }
                    return Promise.resolve(false);    
                }
                return Promise.resolve(false);
            });
        }
        return Promise.resolve(false);
    }
    saveClientData(context, instance, mobStatus, promises) {
        if (context.currentPage.isModal()) { // We have to close this page to show Signature Control Modal
            promises.push(context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action'));
            // Since we are closing this page, we have to save the data on parent page
            context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().currentObject = context.binding.WorkOrderHeader;
            context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().currentObject.OperationNo = context.binding.Operation;
            context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().currentObject.OperationObject = context.binding.OperationObject;
            context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().currentObject.SubOperationNo = context.binding.SubOperation;
            context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().currentInstance = instance;
            context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().MobileStatusReadLink = mobStatus['@odata.readLink'];
            context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().MobileStatusObjectKey = mobStatus.ObjectKey;
            context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().MobileStatusObjectType = mobStatus.ObjectType;
        } else {
            context.getClientData().currentObject = context.binding.WorkOrderHeader;
            context.getClientData().currentObject.OperationNo = context.binding.Operation;
            context.getClientData().currentObject.OperationObject = context.binding.OperationObject;
            context.getClientData().currentObject.SubOperationNo = context.binding.SubOperation;
            context.getClientData().currentInstance = instance;
            context.getClientData().MobileStatusReadLink = mobStatus['@odata.readLink'];
            context.getClientData().MobileStatusObjectKey = mobStatus.ObjectKey;
            context.getClientData().MobileStatusObjectType = mobStatus.ObjectType;
        }
        return context;
    }
    executeMobileStatusComplete(context) {
        // We are closing the Confirmation Create Update Page before calling this method so the MobileStatusComplete action
        // context will be different and saved into previous page
        
        return context.executeAction('/SAPAssetManager/Actions/Confirmations/MobileStatusSetComplete.action');
    }

    dismissCurrentModalPage(context) {
        if (context.currentPage.isModal()) { 
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                return Promise.resolve(true);
            });
        } else {
            return Promise.resolve(true);
        }
    }
}

