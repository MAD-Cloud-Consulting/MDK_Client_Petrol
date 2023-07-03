export default function DeviceDisplay(context) {
    try {
        if (context.getPageProxy().binding.Device_Nav) {
            return context.getPageProxy().binding.Device_Nav.DeviceCategory;
        } else {
            return context.getPageProxy().binding.DeviceCategory;
        }
    } catch (exc) {
        return '-';
    }
}
