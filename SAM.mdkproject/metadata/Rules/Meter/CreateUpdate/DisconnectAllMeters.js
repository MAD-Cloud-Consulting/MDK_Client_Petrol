import libCommon from '../../Common/Library/CommonLibrary';
import libMeter from '../../Meter/Common/MeterLibrary';

export default function DisconnectAllMeters(context) {
    libCommon.setOnChangesetFlag(context, true);
    libCommon.resetChangeSetActionCounter(context);

    let extension = context.getControl('FormCellContainer')._control;
    
    let action = '';
    
    if (libMeter.getISUProcess(context.binding.OrderISULinks) === 'DISCONNECT') {
        action = '/SAPAssetManager/Actions/Meters/DisconnectMetersChangeSet.action';
    } else {
        action = '/SAPAssetManager/Actions/Meters/ReconnectMetersChangeSet.action';
    }

    return extension.executeChangeSet(action, 0);
}
