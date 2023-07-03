import libCommon from '../../../Common/Library/CommonLibrary';
import freeForm from '../CharacteristicsFreeValue';
export default function CharacteristicsDateFreeFormVisible(formCellContainerProxy) {
    let dataType = formCellContainerProxy.binding.Characteristic.DataType;
    let singleValue = formCellContainerProxy.binding.Characteristic.SingleValue;

    if (singleValue === 'X' && dataType === 'DATE' && freeForm(formCellContainerProxy)) {
        libCommon.setStateVariable(formCellContainerProxy, 'VisibleControlFrom',formCellContainerProxy.getName());
        libCommon.setStateVariable(formCellContainerProxy, 'ListPicker',false);
        return true;
    }
    return false;
}
