export default function ConnectedStatus(context) {
    return context.getPageProxy().binding.Device_Nav.DeviceBlocked? context.localizeText('disconnect') : context.localizeText('connected');
}
