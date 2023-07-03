import libVal from '../../Common/Library/ValidationLibrary';
import OffsetODataDate from '../../Common/Date/OffsetODataDate';

export default function InspectionEndDate(context) {
    var binding = context.binding.InspectionLot_Nav;
    if (libVal.evalIsEmpty(binding.EndDate)) {
        return context.localizeText('no_inspection_start_date');
    } else {
        let odataDate = new OffsetODataDate(context,binding.EndDate);
        return context.formatDate(odataDate.date());
    }
}
