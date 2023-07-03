import libVal from '../../Common/Library/ValidationLibrary';
import OffsetODataDate from '../../Common/Date/OffsetODataDate';

export default function InspectionLotDetailsInspectionStartDate(context) {
    let binding = context.getBindingObject();
    if (libVal.evalIsEmpty(binding.StartDate)) {
        return '-';
    }
    let odataDate = new OffsetODataDate(context,binding.StartDate);
    return context.formatDate(odataDate.date());
}
