import {ValueIfExists} from './Formatter';

export default function MeterReadingRecorded(context) {
    let equipment = context.evaluateTargetPathForAPI('#Page:MeterDetailsPage').binding.EquipmentNum;
    let register = context.binding.RegisterNum;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', ['MeterReadingRecorded'], `$filter=EquipmentNum eq '${equipment}' and Register eq '${register}'&$orderby=MeterReadingDate desc, MeterReadingTime desc`).then(function(result) {
        if (result && result.length > 0) {
            return ValueIfExists(Number(result.getItem(0).MeterReadingRecorded), '-', function(value) {
                return context.formatNumber(value);
            });
        } else {
            return '-';
        }
    });
}
