import Constants from '../Common/Library/ConstantsLibrary';
import libCommon from '../Common/Library/CommonLibrary';

export default function NoteReadlink(context) {

    let note = libCommon.getStateVariable(context, Constants.noteStateVariable);
    if (note) {            
        return note['@odata.readLink'];
    }
    return '';

}
