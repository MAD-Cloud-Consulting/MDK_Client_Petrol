import ODataDate from '../../Common/Date/ODataDate';

/**
 * Rule to format the work order end date value as "<day of week>, MM/dd/YYYY"
 * @param {*} context
 * @returns {String} Formatted date string.
 */
export default function WorkOrderHistoryDetailsEndDate(context) {
    let binding = context.binding;
    if (binding.EndDate) {
        let endDateTime = new ODataDate(binding.EndDate);
        return context.formatDate(endDateTime.date());
    } else {
        return context.localizeText('ongoing');
    }
}

