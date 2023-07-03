/**
   * Get the characteristics values of the "DATE" data type but for "Single Value" type of Input.
   * Loop through all the characteristics and add it to the list picker after parsing them.
   * 
   * @param {} context
   * 
   * @returns {string} returns the sorted array of values with all the characteristic
   * 
   */

import libCom from '../../Common/Library/CommonLibrary';
import dateDisplayValue from '../Characteristics/Date/CharacteristicsDateDisplayValue';
import dateReturnValue from '../Characteristics/Date/CharacteristicsDateReturnValue';
import sorter from '../Characteristics/CharacteristicSorter';
import assembleDisplayValues from './CharacteristicAssembleDisplayValue';
import assembleReturnValues from '../Characteristics/Date/CharacteristicAssembleReturnValueForDate';
import defaultCharacteristics from './CharacteristicsDefaultValues';
export default function CharacteristicSingleValuesForDate(context) {
    var jsonResult = [];
    let controlNameFrom = libCom.getStateVariable(context,'VisibleControlFrom');

    let classCharValues = defaultCharacteristics(context);
    for (var k = 0; k < classCharValues.length; k++) {
        let resultObj = classCharValues[k];
        if (controlNameFrom === 'DateSingleValue') {
            jsonResult.push(
                {
                    'DisplayValue': assembleDisplayValues(context,resultObj.ValueRel, dateDisplayValue(context,resultObj.CharValFrom),dateDisplayValue(context, resultObj.CharValTo), 'SingleValues'),
                    'ReturnValue': assembleReturnValues(context, resultObj.ValueRel, parseInt(dateReturnValue(resultObj.CharValFrom)), parseInt(dateReturnValue(resultObj.CharValTo)), 'SingleValues'),
                });
        }
                
    }
    return jsonResult.sort(sorter);
}
