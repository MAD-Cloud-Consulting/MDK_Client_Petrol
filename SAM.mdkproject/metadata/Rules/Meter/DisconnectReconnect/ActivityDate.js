import libCommon from '../../Common/Library/CommonLibrary';
import ODataDate from '../../Common/Date/ODataDate';

export default function ActivityDate(context) {
    let date = libCommon.getControlProxy(context,'DatePicker').getValue();
    let odataDate = new ODataDate(date);
    return odataDate.toDBDateString(context);
}
