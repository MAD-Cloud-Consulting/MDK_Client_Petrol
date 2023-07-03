import libCommon from '../../../Common/Library/CommonLibrary';
import freeForm from '../CharacteristicsFreeValue';

export default function CharacteristicDateSingleValueVisible(formCellContainerProxy) {
    let dataType = formCellContainerProxy.binding.Characteristic.DataType;
    let singleValue = formCellContainerProxy.binding.Characteristic.SingleValue;
    if (singleValue === 'X' && dataType === 'DATE' && !freeForm(formCellContainerProxy)) {
        libCommon.setStateVariable(formCellContainerProxy, 'VisibleControlFrom',formCellContainerProxy.getName());
        libCommon.setStateVariable(formCellContainerProxy, 'ListPicker',true);
        return true;
    }
    return false;
}
