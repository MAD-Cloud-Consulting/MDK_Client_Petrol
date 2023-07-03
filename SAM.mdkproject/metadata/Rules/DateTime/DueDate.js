import libVal from '../Common/Library/ValidationLibrary';
import OffsetODataDate from '../Common/Date/OffsetODataDate';

export default function DueDate(context) {
    var binding = context.binding;
    if (libVal.evalIsEmpty(binding.DueDate)) {
        return context.localizeText('no_due_date');
    }

    let odataDate = new OffsetODataDate(context,binding.DueDate);
    return context.formatDate(odataDate.date());
}
