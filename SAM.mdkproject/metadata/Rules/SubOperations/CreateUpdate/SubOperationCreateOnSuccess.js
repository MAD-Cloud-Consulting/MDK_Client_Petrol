import libCommon from '../../Common/Library/CommonLibrary';
import { NoteLibrary as NoteLib, TransactionNoteType} from '../../Notes/NoteLibrary';

export default function SubOperationCreateOnSuccess(pageProxy) {

    //In order to handle note creation during the changeset action we need to keep a counter of the all the acitons for readlink purposes
    libCommon.incrementChangeSetActionCounter(pageProxy);

    let note = libCommon.getFieldValue(pageProxy, 'LongTextNote', '', null, true);
    if (note) {
        NoteLib.setNoteTypeTransactionFlag(pageProxy, TransactionNoteType.workOrderSubOperation());
        pageProxy.executeAction('/SAPAssetManager/Actions/Notes/Create/NotesCreateOnWOSubOperation.action');
    } else {
        pageProxy.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
    }
    
}
