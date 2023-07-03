import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function MileageAddEditOrderId(pageProxy) {
    return CommonLibrary.getListPickerValue(CommonLibrary.getControlProxy(pageProxy,'OrderLstPkr').getValue());
}
