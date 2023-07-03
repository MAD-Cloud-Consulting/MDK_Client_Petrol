import libCommon from '../../../Common/Library/CommonLibrary';
import freeForm from '../CharacteristicsFreeValue';
export default function CharacteristicsTimeFreeFormVisible(formCellContainerProxy) {
    let dataType = formCellContainerProxy.binding.Characteristic.DataType;
    let singleValue = formCellContainerProxy.binding.Characteristic.SingleValue;

    if (singleValue === 'X' && dataType === 'TIME' && freeForm(formCellContainerProxy)) {
        libCommon.setStateVariable(formCellContainerProxy, 'VisibleControlFrom',formCellContainerProxy.getName());
        libCommon.setStateVariable(formCellContainerProxy, 'ListPicker',false);
        return true;
    }
    return false;
}
