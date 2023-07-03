import OffsetODataDate from '../../../Common/Date/OffsetODataDate';

export default function PreviousReadingDate(context) {
    if (context.binding.PreviousReadingDate && context.binding.PreviousReadingTime) {
        let odataDate = OffsetODataDate(context, context.binding.PreviousReadingDate, context.binding.PreviousReadingTime);
        return context.formatDate(odataDate.date());
    } else {
        return '-';
    }
}
