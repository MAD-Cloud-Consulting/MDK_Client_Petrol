import libCom from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import libVal from '../../../SAPAssetManager/Rules/Common/Library/ValidationLibrary';

export default function MeterReadingCreateEntitySet(context) {
    let readingObj = libCom.getStateVariable(context, 'METERREADINGOBJ') || context.binding;
    if (!readingObj.DeviceLink) {
        readingObj.DeviceLink = readingObj.Device_Nav;
    }
    let equipDesc = readingObj.DeviceLink.Equipment_Nav.EquipDesc;
    if (!libVal.evalIsEmpty(equipDesc)) {
        return equipDesc;
    } else {
        return '';
    }
}
