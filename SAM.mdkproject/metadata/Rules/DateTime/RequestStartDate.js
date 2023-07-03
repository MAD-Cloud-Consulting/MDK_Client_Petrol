import libVal from '../Common/Library/ValidationLibrary';
import OffsetODataDate from '../Common/Date/OffsetODataDate';

export default function RequestStartDate(context) {
    var binding = context.binding;
    if (libVal.evalIsEmpty(binding.RequestStartDate)) {
        return context.localizeText('no_request_start_date');
    }

    let odataDate = new OffsetODataDate(context,binding.RequestStartDate);
    return context.formatDate(odataDate.date());
}
