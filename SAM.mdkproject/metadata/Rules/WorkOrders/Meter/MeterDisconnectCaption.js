import libMeter from '../../Meter/Common/MeterLibrary';

export default function MeterDisconnectCaption(context) {
    if (libMeter.getMeterTransactionType(context) === 'DISCONNECT') {
        return context.localizeText('disconnect_meter');
    } else {
        return context.localizeText('reconnect_meter');
    }
}
