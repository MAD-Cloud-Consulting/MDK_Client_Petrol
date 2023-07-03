import valueRelSign from './CharacteristicsValueRelToSign';
import valueSignToRel from './CharacteristicsSignToValueRel';
import libVal from '../../Common/Library/ValidationLibrary';

export default function CharacteristicAssembleDisplayValue(context,valueRel,valueFrom,valueTo, dataType, showUOM=false) {
    let valueSigns  = valueRelSign(valueRel);
    let valueRelation = valueSignToRel(valueSigns);
    let unitOfMeasure;
    if (showUOM) {
        unitOfMeasure = libVal.evalIsEmpty(context.binding.Characteristic.UoM) ? '' :  ' ' + context.binding.Characteristic.UoMExt;  
    } else {
        unitOfMeasure = '';
    }
    // When the values are coming from Object level, we have to check the relation
    // and get the values based on that. For Example: For ValueRelation = 9, valueTo
    // would be dummy and always needs to go to valueFrom.
    if (dataType === 'MultipleValues') {
        if (valueRelation === '6' || valueRelation=== '7' ) {
            valueFrom = '0';
        } else if (valueRelation === '8' || valueRelation === '9') {
            valueTo = '0';
        }
    }
    valueFrom = (valueFrom === '0' || parseInt(valueFrom).toExponential() === '-1e+17' || parseInt(valueFrom).toExponential() === '1e+17') ? '' : valueFrom +  unitOfMeasure;
    valueTo = (valueTo === '0' || parseInt(valueTo).toExponential() === '-1e+17' || parseInt(valueTo).toExponential() === '1e+17') ? '' : valueTo + unitOfMeasure;
    if (valueSigns.length > 1) { // There are more than one sign to show 
        return valueSigns[0] + valueFrom + valueSigns[1] + valueTo;
    } 
    return valueSigns[0] + valueFrom + valueTo;
}
