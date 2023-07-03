import {ValueIfExists} from './Formatter';

export default function ErrorMaxLimit(context) {
    let equipment = context.evaluateTargetPathForAPI('#Page:MeterDetailsPage').binding.EquipmentNum;
    let register = context.binding.RegisterNum;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', [], `$filter=EquipmentNum eq '${equipment}' and Register eq '${register}' and sap.entityexists(ReadLimit_Nav)&$expand=ReadLimit_Nav&$orderby=MeterReadingDate desc`).then(function(result) {
        if (result && result.length > 0) {
            return ValueIfExists(String(result.getItem(0).ReadLimit_Nav.ErrorMaxLimit), '-');
        } else {
            return '-';
        }
    });
}
