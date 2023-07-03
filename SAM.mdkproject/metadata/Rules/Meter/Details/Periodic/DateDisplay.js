import OffsetODataDate from '../../../Common/Date/OffsetODataDate';

export default function DateDisplay(context) {
    if (context.getPageProxy().binding.Device_Nav.ActivityDate && context.getPageProxy().binding.Device_Nav.ActivityTime) {
        let odataDate = OffsetODataDate(context, context.getPageProxy().binding.Device_Nav.ActivityDate, context.getPageProxy().binding.Device_Nav.ActivityTime);
        return context.formatDate(odataDate.date());
    } else {
        return '-';
    }
}
