import ODataDate from '../../../Common/Date/ODataDate';
import libCommon from '../../../Common/Library/CommonLibrary';

export default function GetCreatedDate(context) {
    let pickedDate = libCommon.getControlValue(libCommon.getControlProxy(context, 'CreateDatePicker'));
    let date = new Date(pickedDate);
    let odataDate = new ODataDate(date);
    return odataDate.toDBDateString(context);
}
