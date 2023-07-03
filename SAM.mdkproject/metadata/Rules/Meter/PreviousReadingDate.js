export default function PreviousReadingDate(context) {
    let equipment = context.binding.EquipmentNum;
    if (context.binding.BatchEquipmentNum) {
        equipment = context.binding.BatchEquipmentNum;
    }
    let register = context.binding.RegisterNum;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', [], `$filter=EquipmentNum eq '${equipment}' and Register eq '${register}'&$orderby=MeterReadingDate desc`).then(function(result) {
        let meterReadingDate = new Date();
        if (result && result.length > 0 && (meterReadingDate = result.getItem(0).MeterReadingDate)) {
            return meterReadingDate;
        } else {
            return new Date();
        }
    });
}
