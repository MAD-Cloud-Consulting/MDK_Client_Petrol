import OffsetODataDate from '../../Common/Date/OffsetODataDate';


export default function MeasuringPointHistoryReadingTime(clientAPI) {
    let binding = clientAPI.getBindingObject();
    if (binding.ReadingTime) {
        let odataDate = new OffsetODataDate(clientAPI, binding.ReadingDate, binding.ReadingTime);
        return clientAPI.formatTime(odataDate.date(),'','',{format: 'short'});
    } else {
        return '-';
    } 
}
