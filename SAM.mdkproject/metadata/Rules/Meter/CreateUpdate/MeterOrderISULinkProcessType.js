import libMeter from '../../Meter/Common/MeterLibrary';

export default function MeterOrderISULinkProcessType(context) {
    let meterTransactionType = libMeter.getMeterTransactionType(context);
    if (meterTransactionType.includes('REP_INST')) {
        return 'REP_INST';
    }
    return 'INSTALL';
}
