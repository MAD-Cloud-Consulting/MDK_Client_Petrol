import libVal from '../../Common/Library/ValidationLibrary';
import ODataDate from '../../Common/Date/ODataDate';

export default function WorkOrderHistoryStartEndDate(context) {
    var binding = context.binding;

    //yyyy-mm-dd
    let startDate = !libVal.evalIsEmpty(binding.StartDate) ? context.formatDate(new ODataDate(binding.StartDate).date()) : '';
    let endDate = !libVal.evalIsEmpty(binding.EndDate) ? context.formatDate(new ODataDate(binding.EndDate).date()): context.localizeText('ongoing');

    return startDate + ' - ' + endDate;
} 

