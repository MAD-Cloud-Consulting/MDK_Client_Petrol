export default function DeviceLocationDisplay(context) {
    try {
        return context.binding.DeviceLocation_Nav.Description;
    } catch (exc) {
        if (context.getPageProxy) {
            return context.getPageProxy().binding.DeviceLocation_Nav.Description;
        } else {
            return '-';
        }
    }
}
