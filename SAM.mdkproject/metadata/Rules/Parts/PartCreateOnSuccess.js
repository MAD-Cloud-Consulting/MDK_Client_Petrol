
import libCommon from '../Common/Library/CommonLibrary';
import { NoteLibrary as NoteLib, TransactionNoteType} from '../Notes/NoteLibrary';

export default function PartCreateOnSuccess(pageProxy) {

    //In order to handle note creation during the changeset action we need to keep a counter of the all the acitons for readlink purposes
    libCommon.incrementChangeSetActionCounter(pageProxy);

    let note = libCommon.getFieldValue(pageProxy, 'LongTextNote', '', null, true);
    if (note) {
        NoteLib.setNoteTypeTransactionFlag(pageProxy, TransactionNoteType.part());
        return pageProxy.executeAction('/SAPAssetManager/Actions/Notes/Create/NotesCreateOnParts.action');
    } else {
        return pageProxy.executeAction('/SAPAssetManager/Actions/Page/ClosePageToastCreate.action');
    }
    
}
