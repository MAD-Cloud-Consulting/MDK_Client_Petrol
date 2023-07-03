import libMeter from '../../Meter/Common/MeterLibrary';

export default function MeterIsEditable(context) {

    if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().FromErrorArchive) {
        return false;
    } else if (context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().ErrorObject) {
        return false;
    } else {
        let meterTransactionType = libMeter.getMeterTransactionType(context);
        if (meterTransactionType === 'INSTALL' || meterTransactionType === 'REP_INST') {
            return true;
        }
    }
    return false;
}
