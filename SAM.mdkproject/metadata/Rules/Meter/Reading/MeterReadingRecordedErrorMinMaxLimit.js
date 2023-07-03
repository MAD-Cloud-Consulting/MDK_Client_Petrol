import libCommon from '../../Common/Library/CommonLibrary';

export default function MeterReadingRecordedErrorMinMaxLimit(context) {
    let equipment = context.binding.EquipmentNum;
    let register = context.binding.RegisterNum;
    if (!libCommon.isDefined(register)) {
        register = context.binding.Register;
    }
    if (!libCommon.isDefined(equipment)) {
        equipment = context.evaluateTargetPathForAPI('#Page:MeterDetailsPage').binding.EquipmentNum;
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', [], `$filter=EquipmentNum eq '${equipment}' and Register eq '${register}' and sap.entityexists(ReadLimit_Nav)&$expand=ReadLimit_Nav&$orderby=MeterReadingDate desc, MeterReadingTime desc`).then(function(result) {
        if (result && result.length > 0) {
            return String(result.getItem(0).ReadLimit_Nav.ErrorMinLimit) + ' - ' + String(result.getItem(0).ReadLimit_Nav.ErrorMinLimit);
        } else {
            return '';
        }
    });
}
