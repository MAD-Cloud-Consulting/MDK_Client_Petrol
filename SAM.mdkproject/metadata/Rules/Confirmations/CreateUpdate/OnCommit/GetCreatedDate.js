import ODataDate from '../../../Common/Date/ODataDate';

export default function GetCreatedDate(context) {
    let date = new Date();
    let odataDate = new ODataDate(date);
    return odataDate.toDBDateString(context);
}
