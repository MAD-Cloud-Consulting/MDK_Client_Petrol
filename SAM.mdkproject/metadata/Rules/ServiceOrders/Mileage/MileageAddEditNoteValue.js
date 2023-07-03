import IsNotOnCreate from '../../Common/IsNotOnCreate';

export default function MileageAddEditNoteValue(context) {
    if (IsNotOnCreate(context)) { //During Edit if there is a note value then display it
        let binding = context.binding;
        let longText = binding.LongText;

        if (longText && longText.length > 0) {
            return longText[0].TextString;
        }
    }

    return '';

}
