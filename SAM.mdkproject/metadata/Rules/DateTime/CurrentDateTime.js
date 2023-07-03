import ODataDate from '../Common/Date/ODataDate';

export default function CurrentDateTime(context) {
    let odataDate = new ODataDate();
    return odataDate.toDBDateTimeString(context);
}
