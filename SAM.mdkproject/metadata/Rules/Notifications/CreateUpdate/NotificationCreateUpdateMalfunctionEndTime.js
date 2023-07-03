import OffsetODataDate from '../../Common/Date/OffsetODataDate';

export default function NotificationCreateUpdateMalfunctionEndTime(pageClientAPI) {
    var binding = pageClientAPI.binding;
    var endDateTime;
    let value = '';
    if (binding.MalfunctionEndDate) {
        endDateTime = new OffsetODataDate(pageClientAPI,binding.MalfunctionEndDate, binding.MalfunctionEndTime);
    }
    if (binding.MalfunctionEndTime && endDateTime) {
        value = endDateTime.date().toISOString();
    }
    return value;
}
