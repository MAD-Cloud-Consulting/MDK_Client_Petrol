export default function PreviousReadingTime(context) {
    let equipment = context.binding.EquipmentNum;
    if (context.binding.BatchEquipmentNum) {
        equipment = context.binding.BatchEquipmentNum;
    }
    let register = context.binding.RegisterNum;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', [], `$filter=EquipmentNum eq '${equipment}' and Register eq '${register}'&$orderby=MeterReadingDate desc`).then(function(result) {
        if (result && result.length > 0) {
            return result.getItem(0).MeterReadingTime;
        } else {
            return '00:00';
        }
    });
}
