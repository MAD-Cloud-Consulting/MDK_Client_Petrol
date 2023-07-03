import libVal from '../../Common/Library/ValidationLibrary';
import OffsetODataDate from '../../Common/Date/OffsetODataDate';

export default function InspectionLotEndDate(context) {
    let binding = context.getBindingObject();
    if (libVal.evalIsEmpty(binding.InspectionLot_Nav.EndDate)) {
        return '-';
    }
    let odataDate = new OffsetODataDate(context,binding.InspectionLot_Nav.EndDate);
    return context.formatDate(odataDate.date());
}
