import {ValueIfExists} from './Formatter';

export default function WarningMinLimit(context) {
    let equipment = context.evaluateTargetPathForAPI('#Page:MeterDetailsPage').binding.EquipmentNum;
    let register = context.binding.RegisterNum;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', [], `$filter=EquipmentNum eq '${equipment}' and Register eq '${register}' and sap.entityexists(ReadLimit_Nav)&$expand=ReadLimit_Nav&$orderby=MeterReadingDate desc, MeterReadingTime desc`).then(function(result) {
        if (result && result.length > 0) {
            return ValueIfExists(String(result.getItem(0).ReadLimit_Nav.WarningMinLimit), '-');
        } else {
            return '-';
        }
    });
}
