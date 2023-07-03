/**
   * Get the Characteristic Value From Control value from the appropriate control.
   * 
   * @param {} context
   * 
   * @returns {string} returns the appropriate value.
   * 
   */
import formattedDateTime from './Date/CharacteristicFormattedDateTime';
export default function CharacteristicValueFromControl(context, control) {
    var value;    
    switch (control.getType()) {
        case 'Control.Type.FormCell.ListPicker':
            value = control.getValue().length === 0 ? '' : control.getValue()[0].ReturnValue;
            break;
        case 'Control.Type.FormCell.SimpleProperty':
            value = control.getValue();
            break;
        case 'Control.Type.FormCell.DatePicker':
            value = parseFloat(formattedDateTime(context, control.getValue()));
            break;
        default:
            break;
    }
    return value;
}

