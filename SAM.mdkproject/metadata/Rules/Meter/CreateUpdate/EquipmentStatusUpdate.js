import libMeter from '../../Meter/Common/MeterLibrary';

export default function EquipmentStatusUpdate(context) {

    let meterTransactionType = libMeter.getMeterTransactionType(context);
    if (meterTransactionType === 'INSTALL' || meterTransactionType === 'REP_INST') {
        return 'I0100';
    } else if (meterTransactionType === 'REMOVE' || meterTransactionType === 'REPLACE') {
        return 'LOC01';
    }
    return '';
}
