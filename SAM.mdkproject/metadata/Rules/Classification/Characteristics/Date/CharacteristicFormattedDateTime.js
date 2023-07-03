import ODataDate from '../../../Common/Date/ODataDate';
import formatDate from './CharacteristicFormatDate';

export default function CharacteristicFormattedDateTime(context, date) {
    if (context.binding.Characteristic.DataType === 'DATE') {
       return formatDate(date);
    } else {
        return new ODataDate(date).toDBTimeString(context).replace(/:/g,'');
    }     
}
