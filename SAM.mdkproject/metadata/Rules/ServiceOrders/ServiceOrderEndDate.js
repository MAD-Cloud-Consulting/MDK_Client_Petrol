import libVal from '../Common/Library/ValidationLibrary';
import OffsetODataDate from '../Common/Date/OffsetODataDate';

export default function ServiceOrderEndDate(context) {
    let endDate = context.binding.ContractDateTo;
    if (!libVal.evalIsEmpty(endDate)) {
        let odataDate = new OffsetODataDate(context,endDate);
        return context.formatDate(odataDate.date());
    } else {
        return '-';
    } 
}
