import libVal from '../Common/Library/ValidationLibrary';
import OffsetODataDate from '../Common/Date/OffsetODataDate';

export default function ServiceOrderStartDate(context) {
    let startDate = context.binding.ContractDateFrom;
    if (!libVal.evalIsEmpty(startDate)) {
        let odataDate = new OffsetODataDate(context,startDate);
        return context.formatDate(odataDate.date());
    } else {
        return '-';
    } 
}
