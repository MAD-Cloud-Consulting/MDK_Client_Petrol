export default function DeviceDisplay(context) {
    try {
        return context.getPageProxy().binding.Device_Nav.DeviceCategory;
    } catch (exc) {
        return '-';
    }
}
