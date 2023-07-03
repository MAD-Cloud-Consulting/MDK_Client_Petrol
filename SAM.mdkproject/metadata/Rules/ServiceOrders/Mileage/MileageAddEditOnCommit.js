import GenerateLocalConfirmationNum from '../../Confirmations/CreateUpdate/OnCommit/GenerateLocalConfirmationNum';
import { TransactionNoteType } from '../../Notes/NoteLibrary';
import { NoteLibrary } from '../../Notes/NoteLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import IsOnCreate from '../../Common/IsOnCreate';
import Logger from '../../Log/Logger';
import PDFGenerateDuringCompletion from '../../PDF/PDFGenerateDuringCompletion';
import MileageAddEditMileage from './MileageAddEditMileage';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';
import WorkOrderCompletionLibrary from '../../WorkOrders/Complete/WorkOrderCompletionLibrary';
import ExecuteActionWithAutoSync from '../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';

export default function MileageAddEditOnCommit(pageProxy) {

    try {
        if (IsOnCreate(pageProxy)) {
            
            return GenerateLocalConfirmationNum(pageProxy).then(confirmationNum => { //Generate a new confirmation number and store it
                pageProxy.getClientData().localConfirmationNum = confirmationNum;
                CommonLibrary.setStateVariable(pageProxy, 'ObjectCreatedName', 'Mileage');
                
                return pageProxy.executeAction('/SAPAssetManager/Actions/ServiceOrders/Mileage/MileageAdd.action').then((result) => { //Create the Mileage Confirmation
                    if (IsCompleteAction(pageProxy)) {
                        var amount = MileageAddEditMileage(pageProxy) + ' km';
                        WorkOrderCompletionLibrary.updateStepState(pageProxy, 'mileage', {
                            value: amount,
                            link: JSON.parse(result.data)['@odata.id'],
                            data: result.data,
                        });
                    }
                    return createNoteIfDefined(pageProxy);                 
                }).finally(() => {
                    if (IsCompleteAction(pageProxy)) { 
                        return WorkOrderCompletionLibrary.getInstance().openMainPage(pageProxy);
                    }

                    return pageProxy.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {    
                        if (CommonLibrary.getStateVariable(pageProxy, 'IsPDFGenerate')) {
                            return PDFGenerateDuringCompletion(pageProxy).then(() => {
                                CommonLibrary.setStateVariable(pageProxy, 'IsPDFGenerate', false);
                                WorkOrderCompletionLibrary.getInstance().setCompleteFlag(pageProxy, false);
                                return Promise.resolve();
                            });
                        }
                        return Promise.resolve();
                    });
                });
            });

        } else {
            return pageProxy.executeAction('/SAPAssetManager/Actions/ServiceOrders/Mileage/MileageEdit.action').then((result) => {
                if (IsCompleteAction(pageProxy)) {
                    var amount = MileageAddEditMileage(pageProxy) + ' km';
                    WorkOrderCompletionLibrary.updateStepState(pageProxy, 'mileage', {
                        value: amount,
                        link: JSON.parse(result.data)['@odata.id'],
                        data: result.data,
                    });
                }

                return editNoteIfDefined(pageProxy).then(() => {
                    if (IsCompleteAction(pageProxy)) {
                        return WorkOrderCompletionLibrary.getInstance().openMainPage(pageProxy);
                    }

                    return ExecuteActionWithAutoSync(pageProxy, '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action');
                }); 
            });
        }
    } catch (error) {
        Logger.error(pageProxy.getGloalDefinition('/SAPAssetManager/Globals/Mileage/MileageGroup.global').getValue(), error);
    }
    
}

function createNoteIfDefined(pageProxy) {
    let note = CommonLibrary.getFieldValue(pageProxy, 'DescriptionNote', '', null, true);
                    
    if (note) {
        NoteLibrary.setNoteTypeTransactionFlag(pageProxy, TransactionNoteType.mileage());
        CommonLibrary.incrementChangeSetActionCounter(pageProxy);
        return pageProxy.executeAction('/SAPAssetManager/Actions/Notes/NoteCreateDuringConfirmationCreate.action');
    } else {
        return Promise.resolve();
    }
}

function editNoteIfDefined(pageProxy) {
    let note = CommonLibrary.getFieldValue(pageProxy, 'DescriptionNote', '', null, true);
                    
    if (note) {
        NoteLibrary.setNoteTypeTransactionFlag(pageProxy, TransactionNoteType.mileage());
        return pageProxy.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateDuringConfirmationUpdate.action');
    } else {
        return Promise.resolve();
    }
}
