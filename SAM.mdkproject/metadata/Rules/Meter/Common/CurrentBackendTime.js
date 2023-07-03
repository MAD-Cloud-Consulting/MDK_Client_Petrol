import ODataDate from '../../Common/Date/ODataDate';
import libCom from '../../Common/Library/CommonLibrary';

export default function CurrentBackendTime(context) {
    let date = libCom.getControlProxy(context,'TimePicker').getValue();
    let odataDate = new ODataDate(date);
    return odataDate.toDBTimeString(context);
}
