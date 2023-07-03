import libCommon from '../../../Common/Library/CommonLibrary';
export default function CharacteristicNumberMultiValueVisible(formCellContainerProxy) {
    let dataType = formCellContainerProxy.binding.Characteristic.DataType;
    let singleValue = formCellContainerProxy.binding.Characteristic.SingleValue;

    if (singleValue === '' && dataType === 'NUM') {
        libCommon.setStateVariable(formCellContainerProxy,'VisibleControlFrom',formCellContainerProxy.getName());
        libCommon.setStateVariable(formCellContainerProxy, 'MultiListPicker',true);
        return true;
    }
    return false;
}
