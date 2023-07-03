import ODataDate from '../../../Common/Date/ODataDate';

export default function TimeEntryViewDate(context) {
    var date = context.binding.Date;
    let odataDate = new ODataDate(date);
    return context.formatDate(odataDate.date());
}
