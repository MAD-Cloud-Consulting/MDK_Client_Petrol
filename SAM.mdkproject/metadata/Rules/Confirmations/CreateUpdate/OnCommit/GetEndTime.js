
import ODataDate from '../../../Common/Date/ODataDate';
import GetEndDateTime from './GetEndDateTime';

export default function GetEndTime(context) {
    let endDateTime = GetEndDateTime(context);
    let odataDate = new ODataDate(endDateTime);
    return odataDate.toDBTimeString(context);
}
