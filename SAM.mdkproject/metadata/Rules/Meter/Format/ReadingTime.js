import OffsetODataDate from '../../Common/Date/OffsetODataDate';

export default function ReadingTime(context) {
    let equipment = context.getPageProxy().binding.EquipmentNum;
    if (context.getPageProxy().binding.BatchEquipmentNum) {
        equipment = context.getPageProxy().binding.BatchEquipmentNum;
    }
    let register = context.binding.RegisterNum;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', [], `$filter=EquipmentNum eq '${equipment}' and Register eq '${register}'&$orderby=MeterReadingDate desc,MeterReadingTime desc`).then(function(result) {
        if (result && result.length > 0) {
            if (result.getItem(0).MeterReadingDate && result.getItem(0).MeterReadingTime) {
                let odataDate = OffsetODataDate(context, result.getItem(0).MeterReadingDate, result.getItem(0).MeterReadingTime);
                return context.formatTime(odataDate.date());
            }
        } 
        return '-';
    });
}
