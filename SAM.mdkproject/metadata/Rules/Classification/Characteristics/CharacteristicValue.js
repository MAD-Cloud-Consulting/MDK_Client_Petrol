
/**
 * Assemble Characteristics with theri respective Unit of Measure to
 * display on the list view.
 */
import assembleDisplayValues from './CharacteristicAssembleDisplayValue';
import dateDisplayValue from './Date/CharacteristicsDateDisplayValue';
import timeDisplayValue from './Time/CharacteristicsTimeDisplayValue';
import charValue from './Character/CharacteristicCharacterDescription';

export default function CharacteristicValue(context, characteristic, withUOM=true) {
    let dataType = characteristic.Characteristic.DataType;
    let singleValue = characteristic.Characteristic.SingleValue;
    let numberOfDecimals = characteristic.Characteristic.NumofDecimal;
    let result = characteristic.CharValue;
    switch (dataType) {
        case 'NUM':
            switch (singleValue) {
                case 'X':
                    result = assembleDisplayValues(context, characteristic.ValueRel, context.formatNumber(characteristic.CharValFrom,'',{maximumFractionDigits:numberOfDecimals}), context.formatNumber(characteristic.CharValTo,'', {maximumFractionDigits:numberOfDecimals}), 'SingleValues', withUOM);
                    break;
                default:
                    result = assembleDisplayValues(context, characteristic.ValueRel,  context.formatNumber(characteristic.CharValFrom,'', {maximumFractionDigits:numberOfDecimals}), context.formatNumber(characteristic.CharValTo, '', {maximumFractionDigits:numberOfDecimals}), 'MultipleValues', withUOM);
                    break;
            }
            break;
        case 'CURR': 
            switch (singleValue) {
                case 'X':
                    result = assembleDisplayValues(context, characteristic.ValueRel, context.formatNumber(characteristic.CharValFrom, '', {maximumFractionDigits:numberOfDecimals}), context.formatNumber(characteristic.CharValTo, '', {maximumFractionDigits:numberOfDecimals}), 'SingleValues', withUOM);
                    break;
                default:
                    result = assembleDisplayValues(context, characteristic.ValueRel,  context.formatNumber(characteristic.CharValFrom, '', {maximumFractionDigits:numberOfDecimals}), context.formatNumber(characteristic.CharValTo, '', {maximumFractionDigits:numberOfDecimals}), 'MultipleValues', withUOM);
                    break;
            }
            break;
        case 'DATE': 
            switch (singleValue) {
                case 'X':
                    result = assembleDisplayValues(context,characteristic.ValueRel, dateDisplayValue(context,characteristic.CharValFrom),dateDisplayValue(context, characteristic.CharValTo), 'SingleValues', withUOM);
                    break;
                default:
                    result = assembleDisplayValues(context, characteristic.ValueRel, dateDisplayValue(context, characteristic.CharValFrom), dateDisplayValue(context, characteristic.CharValTo), withUOM);
                    break;
            }
            break;
        case 'TIME': 
            switch (singleValue) {
                case 'X':
                    result = assembleDisplayValues(context,characteristic.ValueRel, timeDisplayValue(context, characteristic.CharValFrom), '0', 'SingleValues', withUOM);
                    break;
                default:
                    result = assembleDisplayValues(context, characteristic.ValueRel, timeDisplayValue(context, characteristic.CharValFrom), timeDisplayValue(context, characteristic.CharValTo), withUOM);
                    break;
            }
            break;
        default:
            result = charValue(characteristic); 
            break;
    }
    return result;
}
