
import ODataDate from '../../Common/Date/ODataDate';

export default function GetCurrentTime(context) {
    
    let odataDate = new ODataDate();
    return odataDate.toDBTimeString(context);
}
