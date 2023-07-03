import libCommon from '../../../Common/Library/CommonLibrary';

export default function CharacteristicsCharacterMultipleValueVisible(formCellContainerProxy) {
    let dataType = formCellContainerProxy.binding.Characteristic.DataType;
    let singleValue = formCellContainerProxy.binding.Characteristic.SingleValue;
    //* For Multiple list picker we just have to check if it's not a single value
    if (singleValue === '' && dataType === 'CHAR') {
        libCommon.setStateVariable(formCellContainerProxy, 'VisibleControlFrom',formCellContainerProxy.getName());
        libCommon.setStateVariable(formCellContainerProxy, 'MultiListPicker',true);
        return true;
    }
    return false;
}
