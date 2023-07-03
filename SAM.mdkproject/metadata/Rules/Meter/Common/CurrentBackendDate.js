import ODataDate from '../../Common/Date/ODataDate';
import libCom from '../../Common/Library/CommonLibrary';

export default function CurrentBackendDate(context) {
    let date = libCom.getControlProxy(context,'DatePicker').getValue();
    let odataDate = new ODataDate(date);
    return odataDate.toDBDateString(context);
}
