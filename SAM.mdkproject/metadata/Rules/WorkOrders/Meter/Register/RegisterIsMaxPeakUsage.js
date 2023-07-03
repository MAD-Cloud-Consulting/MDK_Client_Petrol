export default function RegisterIsMaxPeakUsage(context) {
    let equipment = context.evaluateTargetPathForAPI('#Page:-Previous').binding.EquipmentNum;
    let register = context.binding.RegisterNum;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', [], `$filter=EquipmentNum eq '${equipment}' and Register eq '${register}'&$orderby=MeterReadingDate desc, MeterReadingTime desc`).then(function(result) {
        if (result && result.length > 0) {
            if (result.getItem(0).DateMaxRead) {
                return context.localizeText('yes');
            }
            return context.localizeText('no');
        } else {
            return context.localizeText('no');
        }
    });
}
