export default function DiscardReading(context) {
    let equipment = context.getPageProxy().binding.EquipmentNum;
    let register = context.binding.Register;
    if (!equipment) {
        equipment = context.evaluateTargetPathForAPI('#Page:MeterDetailsPage').binding.EquipmentNum;
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'PeriodicMeterReadings', [], `$top=1&$filter=EquipmentNum eq '${equipment}' and Register eq '${register}'&$orderby=MeterReadingDate desc, MeterReadingTime desc`).then(function(result) {
        if (result && result.length > 0) {
            context.getPageProxy().setActionBinding(result.getItem(0));
            return context.executeAction('/SAPAssetManager/Actions/Meters/Discard/DiscardPeriodicReading.action');
        } else {
            return '';
        }
    });
}
