import fieldIsRequired from './CharacteristicsFieldIsRequired';
import maxLength from './CharacteristicsMaximumLength';
import negative from './CharacteristicsNegative';
import valueFromControl from '../CharacteristicValueFromControl';
import numberOfDecimals from './CharacteristicsValidateDecimal';
import numberOfChar from './CharacteristicsNumberOfChar';
export default function CharacteristicsValidationControl(context, control) {
    let value = valueFromControl(context, control);
    let dataType = context.binding.Characteristic.DataType;
    if (dataType === 'NUM' || dataType === 'CURR') {
        if (value.includes(',') && !value.includes('.')) {
            value = value.replace(',', '.');
        }
    }
    return fieldIsRequired(context, value, control) && maxLength(context,value,control) && negative(context, value, control) && numberOfDecimals(context, value, control) && numberOfChar(context, value, control);   
}
