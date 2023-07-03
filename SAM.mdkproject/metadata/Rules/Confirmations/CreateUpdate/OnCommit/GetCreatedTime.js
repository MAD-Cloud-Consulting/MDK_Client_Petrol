import ODataDate from '../../../Common/Date/ODataDate';

export default function GetCreatedTime(context) {
    let date = new Date();
    date.setSeconds(0);
    let odataDate = new ODataDate(date);
    return odataDate.toDBTimeString(context);
}
