import ComLib from '../../Common/Library/CommonLibrary';
import { NoteLibrary as NoteLib} from '../../Notes/NoteLibrary';
import noteCreate from '../../Notes/NoteCreateOnCommit';

export default function RejectNoteSave(context) {
    
    //Set the global TransactionType variable to CREATE
    ComLib.setOnCreateUpdateFlag(context, 'CREATE');

    //set the CHANGSET flag to false
    ComLib.setOnChangesetFlag(context, false);

    // Only expect this to be true when setting from a details page
    if (NoteLib.didSetNoteTypeTransactionForBindingType(context)) {    
        return NoteLib.noteDownload(context).then(() => {
            return noteCreate(context);
        });
    }
}
