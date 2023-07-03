import ODataDate from '../Common/Date/ODataDate';

export default function CurrentTime(context) {
    let odataDate = new ODataDate();
    return odataDate.toDBTimeString(context);
}
