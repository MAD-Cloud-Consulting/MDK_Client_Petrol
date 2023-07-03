import libCommon from '../../Common/Library/CommonLibrary';
import ODataDate from '../../Common/Date/ODataDate';

export default function ActivityTime(context) {
    let date = libCommon.getControlProxy(context,'TimePicker').getValue();
    let odataDate = new ODataDate(date);
    return odataDate.toDBTimeString(context);
}
