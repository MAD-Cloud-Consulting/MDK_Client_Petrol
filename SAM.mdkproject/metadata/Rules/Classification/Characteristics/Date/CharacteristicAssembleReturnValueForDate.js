import valueRelSign from '../CharacteristicsValueRelToSign';
import valueSignToRel from '../CharacteristicsSignToValueRel';
import dateReturnValue from '../../Characteristics/Date/CharacteristicsDateReturnValue';
import charValue from '../CharacteristicValueFrom';
import libVal from '../../../Common/Library/ValidationLibrary';

export default function CharacteristicAssembleReturnValueForDate(context, valueRel='', valueFrom='', valueTo='', dataType='') {
    let valueSigns = valueRel === '' ? valueRelSign(context.binding.ValueRel) : valueRelSign(valueRel);
    let valueRelation = valueSignToRel(valueSigns);
    let valueCode = ['2','3','4','5'];

    // The values are empty, meaning the data source is Object Level
    // In Object level, we get dummy values i.e. 1e+17 or -1e+17 but 
    // on Class level we get 0 and no dummy values. So we need to change
    // Object level to class level to be consistent.
    if (valueFrom === '' || valueTo === '' && dataType === '') {
        valueFrom = libVal.evalIsEmpty(context.binding.CharValFrom) || context.binding.CharValFrom.toExponential() === '-1e+17' || context.binding.CharValFrom.toExponential() === '1e+17' ? '0' : dateReturnValue(charValue(context));
        valueTo = libVal.evalIsEmpty(context.binding.CharValTo) || context.binding.CharValTo.toExponential() === '-1e+17' || context.binding.CharValTo.toExponential() === '1e+17' ? '0' : (valueCode.includes(context.binding.ValueRel) ? dateReturnValue(context.binding.CharValTo.toString()) : '0');
    }
    // In Objecet level, If relation ship type is 6 or 7, we get value from ValTo
    // but in Class level, we always get values from ValFrom
    if ((valueRelation === '6'  || valueRelation === '7') && (dataType === 'SingleValues' || dataType === 'MultipleValues')) {
        [valueFrom,valueTo] = [valueTo,valueFrom];
    }
    if (valueSigns.length > 1) { // There are more than one sign to show 
        return valueSigns[0] + '|' +valueFrom + '|' + valueSigns[1] + '|' + valueTo;
    }
    return valueSigns[0] + '|' +valueFrom + '|' + valueTo;
}
