export default function SetBlockedFlag(context) {
    context.binding.Device_Nav.DeviceBlocked = (context.binding.DisconnectActivity_Nav.WOHeader_Nav.OrderISULinks[0].ISUProcess === 'DISCONNECT');
    return context.binding.Device_Nav.DeviceBlocked;
}
