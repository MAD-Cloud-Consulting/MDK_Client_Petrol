/**
   * Get the characteristics values of the "TIME" data type but for "Single Value" type of Input.
   * Loop through all the characteristics and add it to the list picker after parsing them.
   * 
   * @param {} context
   * 
   * @returns {string} returns the sorted array of values with all the characteristic
   * 
   */
import libCom from '../../Common/Library/CommonLibrary';
import timeDisplayValue from '../Characteristics/Time/CharacteristicsTimeDisplayValue';
import sorter from '../Characteristics/CharacteristicSorter';
import assembleDisplayValues from './CharacteristicAssembleDisplayValue';
import assembleReturnValues from './CharacteristicAssembleReturnValue';
import defaultCharacteristics from './CharacteristicsDefaultValues';
export default function CharacteristicSingleValueForTime(context) {
    var jsonResult = [];
    let controlNameFrom = libCom.getStateVariable(context,'VisibleControlFrom');

    let classCharValues = defaultCharacteristics(context);
    for (var k = 0; k < classCharValues.length; k++) {
        let resultObj = classCharValues[k];
        if (controlNameFrom === 'TimeSingleValue') {
            jsonResult.push(
                {
                    'DisplayValue': assembleDisplayValues(context,resultObj.ValueRel, timeDisplayValue(context, resultObj.CharValFrom), timeDisplayValue(context, resultObj.CharValTo), 'SingleValues'),
                    'ReturnValue': assembleReturnValues(context, resultObj.ValueRel, parseInt(resultObj.CharValFrom), parseInt(resultObj.CharValTo), 'SingleValues'),
                });
        }
    }
    return jsonResult.sort(sorter);
}
