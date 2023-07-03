import OffsetODataDate from '../../../Common/Date/OffsetODataDate';

export default function CharacteristicsDateDisplayValue(context, date) {
    var dateString = date.toString();
    if (dateString.length === 8) {
        dateString = [dateString.slice(0,4),'-',dateString.slice(4,6),'-',dateString.slice(6)].join('');
        let odataDate = OffsetODataDate(context, dateString);
        return context.formatDate(odataDate.date());
    }
    return '0';
}
