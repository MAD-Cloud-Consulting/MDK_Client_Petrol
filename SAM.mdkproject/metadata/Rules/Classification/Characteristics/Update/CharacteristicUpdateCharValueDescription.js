import libCom from '../../../Common/Library/CommonLibrary';
import charValueDescription from  '../Character/CharacteristicsCharacterValueDescription';
/**
   * Get the characteristics description of only "CHAR" types
   * 
   * @param {} context
   * 
   * @returns {string} the modified value of the description of the characterisitcs, if empty, return the empty string.
   * 
   */
export default function CharacteristicUpdateCharValueDescription(context) {
    let controlName = libCom.getStateVariable(context,'VisibleControlFrom');
    let control = libCom.getControlProxy(context, controlName);
    let multiPickerIndex = libCom.getStateVariable(context,'ListPickerLoopIndex');

    if (controlName === 'CharacterSingleValue' || controlName === 'CharacterMultipleValue' || controlName === 'CharacterFreeForm') {
        switch (control.getType()) {
            case 'Control.Type.FormCell.ListPicker':
                return control.getValue().length === 0 ? context.binding.CharValDesc : control.getValue().length > 1 ? control.getValue()[multiPickerIndex-1].DisplayValue : control.getValue()[0].DisplayValue;
            case 'Control.Type.FormCell.SimpleProperty':
                return control.getValue();
            default:
                return context.binding.CharValDesc;
        }
    }
    return charValueDescription(context);
}
