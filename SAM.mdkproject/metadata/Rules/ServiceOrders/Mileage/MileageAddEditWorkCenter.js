import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function MileageAddEditWorkCenter(pageProxy) {
    return CommonLibrary.getListPickerValue(CommonLibrary.getControlProxy(pageProxy,'WorkCenterPicker').getValue());
}
