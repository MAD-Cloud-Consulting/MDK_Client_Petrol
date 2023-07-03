import libVal from '../Common/Library/ValidationLibrary';
import OffsetODataDate from '../Common/Date/OffsetODataDate';

export default function RequiredEndDate(context) {
    var binding = context.binding;
    if (libVal.evalIsEmpty(binding.RequiredEndDate)) {
        return context.localizeText('no_required_end_date');
    }

    let odataDate = new OffsetODataDate(context,binding.RequiredEndDate);
    return context.formatDate(odataDate.date());
}
