import OffsetODataDate from '../../../Common/Date/OffsetODataDate';
import charValue from '../CharacteristicValueFrom';

export default function CharacteristicsDate(formCellContainerProxy) {
    var date = charValue(formCellContainerProxy);
    if (formCellContainerProxy.binding.Characteristic.DataType === 'DATE' && date.length > 7) {
        date = [date.slice(0,4),'-',date.slice(4,6),'-',date.slice(6)].join('');
        return OffsetODataDate(formCellContainerProxy, date).date();
    } else {
        return OffsetODataDate(formCellContainerProxy).date();
    }

}
