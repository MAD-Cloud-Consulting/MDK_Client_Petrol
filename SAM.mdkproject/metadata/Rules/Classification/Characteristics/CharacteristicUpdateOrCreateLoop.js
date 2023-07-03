
import libCom from '../../Common/Library/CommonLibrary';
import characteristicCRUD from './Create/CharacteristicCRUD';
/**
 * Loop through all the chars. This function will have the information
 * about if the Control is Multi list picker and how many items are there
 * in the control selected by user. This function will call CRUD function
 * which will decide either we have to do Create/Delete or Create/Update
 * @param {*} context 
 */
export default function CharacteristicUpdateOrCreateLoop(context) {
    let isMultiListPicker = libCom.getStateVariable(context,'MultiListPicker');
    let controlName = libCom.getStateVariable(context,'VisibleControlFrom');
    var control = libCom.getControlProxy(context, controlName);
    libCom.setStateVariable(context,'ListPickerLoopIndex', 0);
    libCom.setStateVariable(context,'ListPickerDeleteIndex', 0);
    if (isMultiListPicker && control.getValue().length === 0) {
        let message = context.localizeText('field_is_required');
        return libCom.executeInlineControlError(context, control, message);
    }
    if (isMultiListPicker) {
        libCom.setStateVariable(context,'ListPickerLoop', control.getValue().length);
        return characteristicCRUD(context);
    } else {
        //* If its not a multi list picker it will always have 1 item i.e either a single list picker
        //* or free form text.
        libCom.setStateVariable(context,'ListPickerLoop', 1);
        return characteristicCRUD(context);
    }
}

