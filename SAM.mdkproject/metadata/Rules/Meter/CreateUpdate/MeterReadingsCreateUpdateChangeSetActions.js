import libCommon from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

export default function MeterReadingsCreateUpdateChangeSetActions(context) {

    let isPeakReading = libCommon.getControlProxy(context, 'PeakTimeSwitch').getValue();

    let pageBinding = libCommon.getStateVariable(context, 'METERREADINGOBJ');
    let equipmentNum = '';
    if (!libVal.evalIsEmpty(pageBinding) && !libVal.evalIsEmpty(pageBinding.DeviceLink)) {
        equipmentNum = pageBinding.DeviceLink.EquipmentNum;
    } else if (!libVal.evalIsEmpty(pageBinding) && !libVal.evalIsEmpty(pageBinding.Device_Nav)) {
        equipmentNum = pageBinding.Device_Nav.EquipmentNum;
    } else if (!libVal.evalIsEmpty(context.binding) && !libVal.evalIsEmpty(context.binding.DeviceLink)) {
        equipmentNum = context.binding.DeviceLink.EquipmentNum;
    } else if (!libVal.evalIsEmpty(context.binding) && !libVal.evalIsEmpty(context.binding.Device_Nav)) {
        equipmentNum = context.binding.Device_Nav.EquipmentNum;
    }
    
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', [], `$filter=sap.islocal() and RegisterGroup eq '${context.binding.RegisterGroup}' and Register eq '${context.binding.RegisterNum}' and EquipmentNum eq '${equipmentNum}'`).then(function(result) {
        let readLink = '';
        if (result.length > 0 && (readLink = result.getItem(0)['@odata.readLink'])) {
            context.binding.MeterReadingReadLink = readLink;
            // a reading exists, do updates
            return ['/SAPAssetManager/Actions/Meters/CreateUpdate/MeterReadingsUpdateForChangeSet.action'];
        } else {
            // no existing reading, do creates
            if (isPeakReading) {
                return ['/SAPAssetManager/Actions/Meters/CreateUpdate/MeterPeakReadingsCreateForChangeSet.action'];
            } else {
                return ['/SAPAssetManager/Actions/Meters/CreateUpdate/MeterReadingsCreateForChangeSet.action'];
            }
        }
    });
}
