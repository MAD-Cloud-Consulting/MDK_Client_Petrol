import libCommon from '../../Library/CommonLibrary';
import ODataDate from '../../Date/ODataDate';

export default function StartDate(context) {
    let dateTime = libCommon.getControlValue(libCommon.getControlProxy(context, 'StartDatePicker'));
    let date = new Date(dateTime);
    let odataDate = new ODataDate(date);

    return odataDate.toDBDateString(context);
}
