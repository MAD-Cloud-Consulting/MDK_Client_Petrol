import OffsetODataDate from '../../Common/Date/OffsetODataDate';

export default function NotificationCreateUpdateMalfunctionStartTime(pageClientAPI) {
    var binding = pageClientAPI.binding;
    var startDateTime;
    let value = '';
    if (binding.MalfunctionStartDate) {
        startDateTime = new OffsetODataDate(pageClientAPI,binding.MalfunctionStartDate, binding.MalfunctionStartTime);
    }
    if (binding.MalfunctionStartTime && startDateTime) {
        value = startDateTime.date().toISOString();
    }
    return value;
}
