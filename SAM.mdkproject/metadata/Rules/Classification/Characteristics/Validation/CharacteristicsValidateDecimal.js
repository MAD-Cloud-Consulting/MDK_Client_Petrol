import libCommon from '../../../Common/Library/CommonLibrary';
import countDecimals from './CharacteristicsCountDecimal';
export default function CharacteristicsValidateDecimal(context, value, control) {
    if ((context.binding.Characteristic.DataType === 'NUM' ||  context.binding.Characteristic.DataType === 'CURR') && countDecimals(value) > context.binding.Characteristic.NumofDecimal) {
        let decimalLimit = context.binding.Characteristic.NumofDecimal;
        let dynamicParams = [decimalLimit];
        let message = context.localizeText('max_number_of_decimals', dynamicParams);
        return libCommon.executeInlineControlError(context, control, message);
    }
    return true;
}
