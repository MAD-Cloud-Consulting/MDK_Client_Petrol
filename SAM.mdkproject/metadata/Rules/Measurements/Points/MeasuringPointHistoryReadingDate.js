import OffsetODataDate from '../../Common/Date/OffsetODataDate';

export default function MeasuringPointHistoryReadingDate(clientAPI) {
    if (clientAPI.binding.ReadingDate) {
        let odataDate = OffsetODataDate(clientAPI, clientAPI.binding.ReadingDate, clientAPI.binding.ReadingTime);
        return clientAPI.formatDate(odataDate.date(),'','',{format: 'medium'});
    } else {
        return '-';
    } 
}
