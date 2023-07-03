import OffsetODataDate from '../../../../Common/Date/OffsetODataDate';

export default function ActivityDetailsDate(context) {

    let binding = context.getPageProxy().binding;
    let odataDate = OffsetODataDate(context, binding.ActivityDate, binding.ActivityTime);
    return context.formatDate(odataDate.date());
}
