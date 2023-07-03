import libVal from '../../../Common/Library/ValidationLibrary';
export default function CharacteristicCharacterDescription(characteristic) {
    return libVal.evalIsEmpty(characteristic.CharValDesc) ? characteristic.CharValue : characteristic.CharValDesc;
}
