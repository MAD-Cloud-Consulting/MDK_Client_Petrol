import { NoteLibrary as NoteLib} from './NoteLibrary';

export default function NotesViewNav(clientAPI) {
    
    // Set the transaction type before navigating to the Note View page
    let page = clientAPI.getPageProxy()._page._definition.getName();
    if (NoteLib.didSetNoteTypeTransactionFlagForPage(clientAPI, page)) {
        return clientAPI.executeAction('/SAPAssetManager/Actions/Notes/NoteViewNav.action');
    }
    return null;
}
