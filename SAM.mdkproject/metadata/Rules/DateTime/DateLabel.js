import ODataDate from '../Common/Date/ODataDate';
/**
* Check if date in params is today or yesterday
* @param {Date} date
*/
export default function ActualDateLabel(date) {
    const defaultOdataDate = new ODataDate(date);
    const now = new ODataDate();
    const yesterday = new ODataDate((new Date()).setDate(now.date().getDate()-1));
    if (defaultOdataDate.toLocalDateString() === now.toLocalDateString()) {
        return 'today';
    } else if (defaultOdataDate.toLocalDateString() === yesterday.toLocalDateString()) {
        return 'yesterday';
    }
    return 'day';
}
