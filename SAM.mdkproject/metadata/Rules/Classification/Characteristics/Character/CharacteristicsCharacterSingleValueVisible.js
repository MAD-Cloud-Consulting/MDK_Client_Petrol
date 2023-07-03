import freeForm from '../CharacteristicsFreeValue';
import libCommon from '../../../Common/Library/CommonLibrary';

export default function CharacteristicsCharacterSingleValueVisible(formCellContainerProxy) {
    let dataType = formCellContainerProxy.binding.Characteristic.DataType;
    let singleValue = formCellContainerProxy.binding.Characteristic.SingleValue;
    if (singleValue === 'X' && dataType === 'CHAR' && !freeForm(formCellContainerProxy)) {
        libCommon.setStateVariable(formCellContainerProxy, 'VisibleControlFrom',formCellContainerProxy.getName());
        libCommon.setStateVariable(formCellContainerProxy, 'ListPicker',true);
        return true;
    }
    return false;
}
