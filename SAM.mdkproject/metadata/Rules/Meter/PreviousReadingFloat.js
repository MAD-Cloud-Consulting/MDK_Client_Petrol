import {ValueIfExists} from './Format/Formatter';

export default function PreviousReadingFloat(context) {
    let equipment;

    if (!(equipment = context.binding.DeviceLink.EquipmentNum)) {
        equipment = context.evaluateTargetPathForAPI('#Page:MeterDetailsPage').binding.EquipmentNum;
    }
    let register = context.binding.RegisterNum;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', [], `$filter=EquipmentNum eq '${equipment}' and Register eq '${register}'&$orderby=MeterReadingDate desc`).then(function(result) {
        if (result && result.length > 0) {
            return ValueIfExists(Number(result.getItem(0).MeterReadingRecorded), 0);
        } else {
            return 0;
        }
    });
}
