import libVal from '../Common/Library/ValidationLibrary';

export default function ReminderFootnote(context) {
    if (!libVal.evalIsEmpty(context.binding.PreferenceValue)) {
        return context.binding.PreferenceValue;
    } else {
        // Adding blank so that padding is there and cell is align with accessory button
        return ' ';
    }
}
