export default function ReadingValue(context) {
    let equipment = context.getPageProxy().binding.EquipmentNum;
    if (context.getPageProxy().binding.BatchEquipmentNum) {
        equipment = context.getPageProxy().binding.BatchEquipmentNum;
    }
    let register = context.binding.RegisterNum;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', ['MeterReadingDate','MeterReadingRecorded'], `$filter=EquipmentNum eq '${equipment}' and Register eq '${register}'&$orderby=MeterReadingDate desc,MeterReadingTime desc`).then(function(result) {
        if (result && result.length > 0) {
            if (result.getItem(0).MeterReadingDate !== null) {
                return context.formatNumber(result.getItem(0).MeterReadingRecorded);
            } else {
                return '-';
            }
        } else {
            return '-';
        }
    });
}
