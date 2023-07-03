import ComLib from '../Common/Library/CommonLibrary';
import { NoteLibrary as NoteLib} from './NoteLibrary';

export default function NoteUpdateNav(clientAPI) {
    
    //Set the global TransactionType variable to CREATE
    ComLib.setOnCreateUpdateFlag(clientAPI, 'CREATE');

    //set the CHANGSET flag to false
    ComLib.setOnChangesetFlag(clientAPI, false);

    return NoteLib.noteDownload(clientAPI).then(note => {
        if (note.NewTextString) {
            return clientAPI.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateNav.action');
        }
        // We need to do this because linter complains about not having a return 
        return '';
    });
}
