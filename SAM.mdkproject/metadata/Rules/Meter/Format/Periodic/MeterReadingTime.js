import OffsetODataDate from '../../../Common/Date/OffsetODataDate';

export default function MeterReadingTime(context) {
    if (context.binding.MeterReadingDate && context.binding.MeterReadingTime) {
        let odataDate = OffsetODataDate(context, context.binding.MeterReadingDate, context.binding.MeterReadingTime);
        return context.formatTime(odataDate.date());
    }
}
