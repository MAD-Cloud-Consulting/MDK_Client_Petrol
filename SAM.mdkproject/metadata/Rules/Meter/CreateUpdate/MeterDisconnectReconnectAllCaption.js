
import libMeter from '../../Meter/Common/MeterLibrary';

export default function MeterDisconnectReconnectAllCaption(context) {
    let isuProcess = libMeter.getISUProcess(context.binding.OrderISULinks);

    if (isuProcess === 'DISCONNECT') {
        return context.localizeText('disconnect_all_meters');
    }
    return context.localizeText('reconnect_all_meters');
}
