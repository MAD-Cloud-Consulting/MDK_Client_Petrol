import libCommon from '../../../Common/Library/CommonLibrary';
import countDecimals from './CharacteristicsCountDecimal';
export default function CharacteristicsNumberOfChar(context, value, control) {
    /*
    ** NumberOfChar is numbers left of the decimal.  So count # of decimal places if they exist,
    ** then subtract from the number of characters in the entire number,
    ** and subract 1 for the decimal point to get the number of characters left
    */
    let numberOfChar = (countDecimals(value) > 0) ? value.length - countDecimals(value) - 1 : value.length;
    let numberAllowed = (context.binding.Characteristic.NumofChar - context.binding.Characteristic.NumofDecimal);
    if (numberOfChar > numberAllowed ) {
        let dynamicParams = [numberAllowed];
        let message = context.localizeText('max_number_of_char', dynamicParams);
        return libCommon.executeInlineControlError(context, control, message);
    }
    return true;
}
