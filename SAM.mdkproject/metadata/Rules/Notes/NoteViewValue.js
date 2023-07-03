import { NoteLibrary as NoteLib} from './NoteLibrary';

export default function NoteViewValue(clientAPI) {
    // This method operates under the assumption Note Transaction Type has already been set    
    return NoteLib.noteDownloadValue(clientAPI).then(result => {
        return result;
    });
}

