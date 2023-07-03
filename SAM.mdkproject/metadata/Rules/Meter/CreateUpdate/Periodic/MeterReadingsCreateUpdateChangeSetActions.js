import libCommon from '../../../Common/Library/CommonLibrary';

export default function MeterReadingsCreateUpdateChangeSetActions(context) {

    let isPeakReading = libCommon.getControlProxy(context, 'PeakTimeSwitch').getValue();
    
    if (isPeakReading) {
        return ['/SAPAssetManager/Actions/Meters/CreateUpdate/Periodic/MeterPeakReadingsUpdateForChangeSet.action'];
    } else {
        return ['/SAPAssetManager/Actions/Meters/CreateUpdate/Periodic/MeterReadingsUpdateForChangeSet.action'];
    }
}
