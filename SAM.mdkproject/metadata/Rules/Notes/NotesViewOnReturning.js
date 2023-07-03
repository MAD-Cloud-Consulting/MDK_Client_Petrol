import {NoteLibrary as NoteLib} from './NoteLibrary';
import Validate from '../Common/Library/ValidationLibrary';

export default function NotesViewOnReturning(context) {

    return NoteLib.noteDownload(context).then(note => {
        let isNoteEditVisible = (note && !Validate.evalIsEmpty(note.NewTextString));
        // Hide/ Display the edit action
        context.setActionBarItemVisible(0, isNoteEditVisible);
    });
}
