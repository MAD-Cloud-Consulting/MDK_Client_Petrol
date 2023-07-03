import OffsetODataDate from '../../../Common/Date/OffsetODataDate';

export default function PreviousReadingTime(context) {
    if (context.binding.PreviousReadingDate && context.binding.PreviousReadingTime) {
        let odataDate = OffsetODataDate(context, context.binding.PreviousReadingDate, context.binding.PreviousReadingTime);
        return context.formatTime(odataDate.date());
    } else {
        return '-';
    }
}
