
import ODataDate from '../../../Common/Date/ODataDate';
import GetStartDateTime from './GetStartDateTime';

export default function GetStartTimeStamp(context) {
    let date = GetStartDateTime(context);
    let odataDate = new ODataDate(date);
    return odataDate.toDBDateTimeString(context);
}
