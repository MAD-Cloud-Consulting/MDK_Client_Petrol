import libCommon from '../Common/Library/CommonLibrary';
import ODataDate from '../Common/Date/ODataDate';
export default function StartDateTime(context) {
    var odataDate = new ODataDate();
    libCommon.setStateVariable(context, 'StatusStartDate', odataDate.date());
    return odataDate.toDBDateTimeString(context);
}
