import OffsetODataDate from '../../../Common/Date/OffsetODataDate';

export default function MeterReadingDate(context) {
    if (context.binding.MeterReadingDate && context.binding.MeterReadingTime) {
        let odataDate = OffsetODataDate(context, context.binding.MeterReadingDate, context.binding.MeterReadingTime);
        return context.formatDate(odataDate.date());
    }
}
