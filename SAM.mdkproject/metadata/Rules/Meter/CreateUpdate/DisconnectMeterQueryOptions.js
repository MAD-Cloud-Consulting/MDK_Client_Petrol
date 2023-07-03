import libMeter from '../../Meter/Common/MeterLibrary';

export default function DisconnectMeterQueryOptions(context) {
    let deviceBlockedFlag = (libMeter.getISUProcess(context.binding.OrderISULinks) !== 'DISCONNECT');
    return `$filter=DisconnectActivity_Nav/OrderId eq '{{#Property:OrderId}}' and Device_Nav/DeviceBlocked eq ${deviceBlockedFlag}&$expand=DisconnectDoc_Nav,DisconnectActivity_Nav/WOHeader_Nav/OrderISULinks,Device_Nav`;
}
