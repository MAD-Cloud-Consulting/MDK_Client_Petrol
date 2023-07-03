import ODataDate from '../../Common/Date/ODataDate';

export default function GetCurrentDate(context) {
    let odataDate = new ODataDate();
    return odataDate.toDBDateString(context);
}
