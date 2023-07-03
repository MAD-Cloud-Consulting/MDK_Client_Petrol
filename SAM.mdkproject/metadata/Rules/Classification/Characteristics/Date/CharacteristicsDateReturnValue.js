import ODataDate from '../../../Common/Date/ODataDate';

export default function CharacteristicsDateReturnValue(date) {
    var dateString = date.toString();
    // The date coming from the backend should be exactly of lenght 8
    if (dateString.length === 8) {
        dateString = [dateString.slice(0,4),'-',dateString.slice(4,6),'-',dateString.slice(6)].join('');
        let odataDate = new ODataDate(dateString);
        return odataDate.date().toISOString().split('T')[0].replace(/-/g,'');
    }
    return '0';
}
