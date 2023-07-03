// Checking if the results characteristics contains any value and if not should be free form

import libVal from '../../Common/Library/ValidationLibrary';
export default function CharacteristicsFreeValue(context) {
    return libVal.evalIsEmpty(context.binding.Characteristic.ClassCharacteristics) ? context.binding.Characteristic.CharacteristicValues.length <= 0 : context.binding.Characteristic.ClassCharacteristics[0].Characteristic.CharacteristicValues.length <= 0;
}
