import libVal from '../../Common/Library/ValidationLibrary';
import {ValueIfExists} from '../../Common/Library/Formatter';

export default function ConfirmationDetailsNotes(context) {
    let longText = context.binding.LongText;

    if (!libVal.evalIsEmpty(longText)) {
        return ValueIfExists(longText[0].TextString);
    }
    return '-';
}
