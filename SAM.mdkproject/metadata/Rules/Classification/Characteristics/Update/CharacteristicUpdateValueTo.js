/**
 * Get the CharValTo value from the appropriate control.
 * 
 * @param {} context
 * 
 * @returns {string} returns the appropriate value.
 * 
 */
import libCom from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';
import formattedDateTime from '../Date/CharacteristicFormattedDateTime';
import deAssembleReturnValues from '../CharacteristicDeAssembleReturnValue';

export default function CharacteristicUpdateValueTo(context) {

    let controlName = libCom.getStateVariable(context,'VisibleControlFrom');
    let charValTo = libVal.evalIsEmpty(context.binding.charValTo) ? '0' : context.binding.charValTo.toString();
    if (!libVal.evalIsEmpty(controlName) && controlName !== 'CharacterSingleValue' && controlName !== 'CharacterMultipleValue' && controlName !== 'CharacterFreeForm') {
        let isListPicker = libCom.getStateVariable(context,'ListPicker');
        let isMultiListPicker = libCom.getStateVariable(context,'MultiListPicker');
        let multiPickerIndex = libCom.getStateVariable(context,'ListPickerLoopIndex');
        let dataType = context.binding.Characteristic.DataType;

        var control = libCom.getControlProxy(context, controlName);

        if (isListPicker) {
            return deAssembleReturnValues(control.getValue()[0].ReturnValue, 'CharValTo');
        } else if (isMultiListPicker) {
            return deAssembleReturnValues(control.getValue()[multiPickerIndex-1].ReturnValue, 'CharValTo');
        }
        let valueCode = ['6','7'];
        if (valueCode.includes(context.binding.ValueRel) && libVal.evalIsEmpty(controlName)) {
            controlName = libCom.getStateVariable(context,'VisibleControlFrom');
            control = libCom.getControlProxy(context, controlName);
        }

        if (!libVal.evalIsEmpty(control)) {
            let single = context.binding.Characteristic.SingleValue;
            switch (control.getType()) {
                case 'Control.Type.FormCell.ListPicker':
                    return control.getValue().length === 0 ? context.binding.CharValTo.toString() : control.getValue().length > 1 ? control.getValue()[multiPickerIndex-1].ReturnValue : control.getValue()[0].ReturnValue;
                case 'Control.Type.FormCell.SimpleProperty': {
                    let value = libVal.evalIsEmpty(control.getValue()) ? control.binding.CharValTo.toString() : control.getValue().toString();
                    if (dataType === 'NUM' || dataType === 'CURR') {
                        if (value.includes(',')) {
                            value = value.replace(',', '.');
                        }
                    }
                    if (single) {
                        value = 0;
                    }
                    return Number(value);
                }
                case 'Control.Type.FormCell.DatePicker':
                    if (single) {
                        return 0;
                    }
                    return parseFloat(formattedDateTime(context, control.getValue()));
                default:
                    return charValTo;
            }
        } 
        return charValTo;
    }
    return charValTo;
}
