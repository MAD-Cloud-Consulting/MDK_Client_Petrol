import libCommon from '../../../Common/Library/CommonLibrary';
import freeForm from '../CharacteristicsFreeValue';
export default function CharacteristicCharacterFreeFormVisible(formCellContainerProxy) {
    let dataType = formCellContainerProxy.binding.Characteristic.DataType;
    let singleValue = formCellContainerProxy.binding.Characteristic.SingleValue;
    //* Check if the Char is a single value with Data Type to CHAR and doesnt exist any default values
    if (singleValue === 'X' && dataType === 'CHAR' && freeForm(formCellContainerProxy)) {
        libCommon.setStateVariable(formCellContainerProxy, 'VisibleControlFrom',formCellContainerProxy.getName());
        libCommon.setStateVariable(formCellContainerProxy, 'ListPicker',false);
        return true;
    }
    return false;
}
