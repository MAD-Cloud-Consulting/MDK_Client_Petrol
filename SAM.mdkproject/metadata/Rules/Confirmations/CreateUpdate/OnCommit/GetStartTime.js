
import libCom from '../../../Common/Library/CommonLibrary';
import ODataDate from '../../../Common/Date/ODataDate';

export default function GetStartTime(context) {
    let date = libCom.getControlProxy(context,'StartTimePicker').getValue();
    date.setSeconds(0);
    let odataDate = new ODataDate(date);
    return odataDate.toDBTimeString(context);
}
