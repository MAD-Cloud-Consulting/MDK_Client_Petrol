import libMeter from '../../Meter/Common/MeterLibrary';

export default function MeterIsVisible(context) {

    let meterTransactionType = libMeter.getMeterTransactionType(context);

    if (meterTransactionType === 'INSTALL' || meterTransactionType === 'REP_INST') {
        return false;
    } 

    return true;
}
