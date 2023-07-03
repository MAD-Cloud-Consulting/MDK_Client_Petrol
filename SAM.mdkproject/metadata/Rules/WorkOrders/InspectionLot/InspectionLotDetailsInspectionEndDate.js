import libVal from '../../Common/Library/ValidationLibrary';
import OffsetODataDate from '../../Common/Date/OffsetODataDate';

export default function InspectionLotDetailsInspectionEndDate(context) {
    let binding = context.getBindingObject();
    if (libVal.evalIsEmpty(binding.EndDate)) {
        return '-';
    }
    let odataDate = new OffsetODataDate(context,binding.EndDate);
    return context.formatDate(odataDate.date());
}
