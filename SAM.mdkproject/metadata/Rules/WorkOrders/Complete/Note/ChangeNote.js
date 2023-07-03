import libCommon from '../../../Common/Library/CommonLibrary';
import { NoteLibrary as NoteLib, TransactionNoteType} from '../../../Notes/NoteLibrary';
import Constants from '../../../Common/Library/ConstantsLibrary';
import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function ChangeNote(context) {
    libCommon.setStateVariable(context, 'IsOnRejectOperation', false);
    
    if (WorkOrderCompletionLibrary.getInstance().isWOFlow()) {
        NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.workOrder());
    } else if (WorkOrderCompletionLibrary.getInstance().isOperationFlow()) { 
        NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.workOrderOperation());
    } else if (WorkOrderCompletionLibrary.getInstance().isSubOperationFlow()) { 
        NoteLib.setNoteTypeTransactionFlag(context, TransactionNoteType.workOrderSubOperation());
    }
    let odata = WorkOrderCompletionLibrary.getInstance().getBinding(context);
   
    let addedNote = WorkOrderCompletionLibrary.getStepData(context, 'note');
   
    if (WorkOrderCompletionLibrary.getInstance().isOperationFlow() && addedNote.TextString) {
        libCommon.setStateVariable(context, Constants.noteStateVariable, addedNote); 
        context.getPageProxy().setActionBinding(odata);
        return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
    }
    
    if (WorkOrderCompletionLibrary.getStepDataLink(context, 'note')) {
        let note = WorkOrderCompletionLibrary.getStepData(context, 'note');
        if (note && !note.NewTextString) {
            note.NewTextString = note.TextString;
        }
        libCommon.setStateVariable(context, Constants.noteStateVariable, note); 
        context.getPageProxy().setActionBinding(odata);
        return context.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
    }
    
    libCommon.setOnCreateUpdateFlag(context, 'CREATE');
    libCommon.setOnChangesetFlag(context, false);
    libCommon.setStateVariable(context, 'SupervisorNote', true);
    
    let noteEntitySet = libCommon.getStateVariable(context, Constants.transactionNoteTypeStateVariable).component;
    return NoteLib.noteDownload(context, odata['@odata.id'] + '/' + noteEntitySet).then(() => {
        context.getPageProxy().setActionBinding(odata);
        return context.executeAction('/SAPAssetManager/Actions/Notes/NoteCreateNav.action');
    });
}
