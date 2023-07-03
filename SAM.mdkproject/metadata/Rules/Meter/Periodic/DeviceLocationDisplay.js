export default function DeviceLocationDisplay(context) {
    try {
        return context.binding.Device_Nav.DeviceLocation_Nav.Description;
    } catch (exc) {
        return '-';
    }
}
