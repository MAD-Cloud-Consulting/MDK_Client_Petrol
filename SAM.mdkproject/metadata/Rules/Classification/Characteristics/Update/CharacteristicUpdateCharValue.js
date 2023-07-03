import libCom from '../../../Common/Library/CommonLibrary';
import charValue from  '../Character/CharacteristicsCharacterValue';
/**
   * Get the characteristics value of only "CHAR" types
   * 
   * @param {} context
   * 
   * @returns {string} the modified value of the characterisitcs, if empty, return the same value.
   * 
   */
export default function CharacteristicUpdateCharValue(context) {
    let controlName = libCom.getStateVariable(context,'VisibleControlFrom');
    let control = libCom.getControlProxy(context, controlName);
    let multiPickerIndex = libCom.getStateVariable(context,'ListPickerLoopIndex');

    if (controlName === 'CharacterSingleValue' || controlName === 'CharacterMultipleValue' || controlName === 'CharacterFreeForm') {
        switch (control.getType()) {
            case 'Control.Type.FormCell.ListPicker':
                return control.getValue().length === 0 ? context.binding.CharValue : control.getValue().length > 1 ? control.getValue()[multiPickerIndex-1].ReturnValue : control.getValue()[0].ReturnValue;
            case 'Control.Type.FormCell.SimpleProperty':
                return control.getValue();
            default:
                return context.binding.CharValue;
        }
    }
    return charValue(context);
}
