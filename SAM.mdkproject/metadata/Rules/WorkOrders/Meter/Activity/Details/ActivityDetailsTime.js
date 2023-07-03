import OffsetODataDate from '../../../../Common/Date/OffsetODataDate';

export default function ActivityDetailsTime(context) {

    let binding = context.getPageProxy().binding;
    let odataDate = OffsetODataDate(context, binding.ActivityDate, binding.ActivityTime);
    return context.formatTime(odataDate.date());
}
