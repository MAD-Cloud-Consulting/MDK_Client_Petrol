import ODataDate from '../../Common/Date/ODataDate';

/**
 * Rule to format the work order end date value as "<day of week>, MM/dd/YYYY"
 * @param {*} context
 * @returns {String} Formatted date string.
 */
export default function WorkOrderHistoryDetailsStartDate(context) {
    let binding = context.binding;
    if (binding.StartDate) {
        let startDateTime = new ODataDate(binding.StartDate);
        return context.formatDate(startDateTime.date());
    } else {
        return '';
    }
}
