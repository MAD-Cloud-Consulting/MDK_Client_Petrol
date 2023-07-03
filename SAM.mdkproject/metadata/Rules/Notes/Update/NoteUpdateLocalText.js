import Constants from '../../Common/Library/ConstantsLibrary';
import ComLib from '../../Common/Library/CommonLibrary';

export default function NoteUpdateLocalText(context) {
    let note = ComLib.getStateVariable(context, Constants.noteStateVariable); 
    if (note && note.NewTextString) {
        return note.NewTextString;
    }
    return '';
}
