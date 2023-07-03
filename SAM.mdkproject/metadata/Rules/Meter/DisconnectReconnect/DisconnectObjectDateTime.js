import OffsetODataDate from '../../Common/Date/OffsetODataDate';

export default function DisconnectObjectDateTime(context) {
    let date = context.binding.ActivityDate;
    let time = context.binding.ActivityTime;
    if (date) {
        return new OffsetODataDate(context, date, time).date();
    }
    return new Date();
}
