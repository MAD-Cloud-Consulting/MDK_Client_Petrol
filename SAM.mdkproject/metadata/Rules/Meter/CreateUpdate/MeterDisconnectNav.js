import libCommon from '../../Common/Library/CommonLibrary';
import libMeter from '../../Meter/Common/MeterLibrary';

export default function MeterRemoveUpdateNav(context) {
    libMeter.setMeterTransactionType(context, 'DISCONNECT');

    //set the CHANGSET flag to true
    libCommon.setOnChangesetFlag(context, true);
    return context.executeAction('/SAPAssetManager/Actions/Meters/MeterDisconnectNav.action');
}
