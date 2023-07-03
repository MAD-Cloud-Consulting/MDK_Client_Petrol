import CommonLibrary from '../../Common/Library/CommonLibrary';
import OffsetODataDate from '../../Common/Date/OffsetODataDate';

export default function RelatedNotificationEndDate(context) {
    let binding = context.binding;

    if (!CommonLibrary.isDefined(binding.RequiredEndDate)) {
        return context.localizeText('no_due_date');
    }

    let odataDate = OffsetODataDate(context, binding.RequiredEndDate);
    return context.formatDate(odataDate.date());
} 
