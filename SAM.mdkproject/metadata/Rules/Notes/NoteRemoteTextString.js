import libCommon from '../Common/Library/CommonLibrary';
import Validate from '../Common/Library/ValidationLibrary';
import Constants from '../Common/Library/ConstantsLibrary';

export default function NoteRemoteTextString(pageClientAPI) {

    let note = libCommon.getStateVariable(pageClientAPI, Constants.noteStateVariable);
    if (note && !Validate.evalIsEmpty(note.TextString)) {
        let existingRemoteNote = note.TextString;        
        if (!Validate.evalIsEmpty(note.NewTextString)) {
            // Remove the local note
            existingRemoteNote = existingRemoteNote.substring(note.NewTextString.length, existingRemoteNote.length);
        }
        return existingRemoteNote.trim();
    }

    return '';
}
