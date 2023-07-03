import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function MileageAddEditOperationNo(pageProxy) {
    return CommonLibrary.getListPickerValue(CommonLibrary.getControlProxy(pageProxy,'OperationPkr').getValue());
}
