export default function ConnectedStatus(context) {
    if (context.getPageProxy().binding['@odata.type'] === '#sap_mobile.DisconnectionObject') {
        if (context.binding.Device_Nav) {
            return context.getPageProxy().binding.Device_Nav.DeviceBlocked? context.localizeText('disconnect') : context.localizeText('connected');
        } else {
            return context.getPageProxy().binding.Device_Nav.DeviceBlocked? context.localizeText('disconnect') : context.localizeText('connected');
        }
    } else {
        return '';
    }
}
