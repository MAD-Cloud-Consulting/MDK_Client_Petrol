import {ValueIfExists} from '../../../Meter/Format/Formatter';

export default function RegisterReadingDifference(context) {
    let equipment = context.evaluateTargetPathForAPI('#Page:-Previous').binding.EquipmentNum;
    let register = context.binding.RegisterNum;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', [], `$filter=EquipmentNum eq '${equipment}' and Register eq '${register}'&$orderby=MeterReadingDate desc, MeterReadingTime desc`).then(function(result) {
        if (result && result.length > 1) {
            return ValueIfExists((result.getItem(0).MeterReadingRecorded - result.getItem(1).PreviousReadingFloat), '-');
        } else {
            return '0';
        }
    });
}
