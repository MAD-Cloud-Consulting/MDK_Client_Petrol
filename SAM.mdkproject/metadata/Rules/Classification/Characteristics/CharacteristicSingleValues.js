/**
   * Get the characteristics values of any data type but for "Single Value" type of Input.
   * Loop through all the characteristics and add it to the list picker
   * 
   * @param {} context
   * 
   * @returns {string} returns the sorted array of values with all the characteristic
   * 
   */
import libCom from '../../Common/Library/CommonLibrary';
import sorter from '../Characteristics/CharacteristicSorter';
import assembleDisplayValues from './CharacteristicAssembleDisplayValue';
import assembleReturnValues from './CharacteristicAssembleReturnValue';
import defaultCharacteristics from './CharacteristicsDefaultValues';
import charValue from '../Characteristics/Character/CharacteristicCharacterDescription';

export default function CharacteristicSingleValues(context) {
    var jsonResult = [];
    let controlNameFrom = libCom.getStateVariable(context,'VisibleControlFrom');
    let classCharValues = defaultCharacteristics(context);
    for (var k = 0; k < classCharValues.length; k++) {
        let resultObj = classCharValues[k];

        if (controlNameFrom === 'CharacterSingleValue' || controlNameFrom === 'CharacterMultipleValue' || controlNameFrom === 'CharacterFreeForm' ) {
            jsonResult.push(
                {
                    'DisplayValue': `${charValue(resultObj)}`,
                    'ReturnValue': resultObj.CharValue,
                });
        } else {
            let numberOfDecimals = context.binding.Characteristic.NumofDecimal;
            jsonResult.push(
                {
                    'DisplayValue': assembleDisplayValues(context, resultObj.ValueRel, context.formatNumber(resultObj.CharValFrom,'', {maximumFractionDigits:numberOfDecimals}), context.formatNumber(resultObj.CharValTo, '', {maximumFractionDigits:numberOfDecimals}), 'SingleValues'),
                    'ReturnValue': assembleReturnValues(context, resultObj.ValueRel, resultObj.CharValFrom.toString(), resultObj.CharValTo.toString(), 'SingleValues'),
                });
            }          
    }
    return jsonResult.sort(sorter);
}
