import libCom from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function MeterReadingCreateEntitySet(context) {
    let readingObj = libCom.getStateVariable(context, 'METERREADINGOBJ') || context.binding;
    if (!readingObj.DeviceLink) {
        readingObj.DeviceLink = readingObj.Device_Nav;
    }
    let entitySet = `${readingObj.DeviceLink['@odata.readLink']}/RegisterGroup_Nav/Registers_Nav`;
    return entitySet;
}
