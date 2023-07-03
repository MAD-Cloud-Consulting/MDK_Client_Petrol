import IsOnCreate from '../../Common/IsOnCreate';

/**
* We'll show the Note field during Create
* We'll show it during Edit only if a note exists
* @param {IClientAPI} context
*/
export default function MileageAddEditIsNoteVisible(context) {
    if (IsOnCreate(context)) {
        return true;
    }

    let binding = context.binding;
    let longText = binding.LongText;

    if (longText && longText.length > 0) {
        return true;
    } else {
        return false;
    }
}
