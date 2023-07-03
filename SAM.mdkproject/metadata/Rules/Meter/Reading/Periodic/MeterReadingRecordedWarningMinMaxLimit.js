import libCommon from '../../../Common/Library/CommonLibrary';

export default function MeterReadingRecordedWarningMinMaxLimit(context) {
    let equipment = context.binding.EquipmentNum;
    let register = context.binding.RegisterNum;
    if (!libCommon.isDefined(register)) {
        register = context.binding.Register;
    }
    if (!libCommon.isDefined(equipment)) {
        equipment = context.evaluateTargetPathForAPI('#Page:MeterDetailsPage').binding.EquipmentNum;
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/Device_Nav/PeriodicMeterReading_Nav`, [], `$filter=EquipmentNum eq '${equipment}' and Register eq '${register}'&$expand=MeterReadingLimit_Nav&$orderby=SchedMeterReadingDate,Register`).then(function(result) {
        if (result && result.length > 0) {
            return String(result.getItem(0).MeterReadingLimit_Nav.WarningMinLimit) + ' - ' + String(result.getItem(0).MeterReadingLimit_Nav.WarningMaxLimit);
        } else {
            return '';
        }
    });
}
