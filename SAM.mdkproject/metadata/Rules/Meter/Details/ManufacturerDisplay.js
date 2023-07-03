export default function ManufacturerDisplay(context) {
    try {
        if (context.binding.Device_Nav) {
            return context.getPageProxy().binding.Device_Nav.Equipment_Nav.Manufacturer;
        } else {
            return context.getPageProxy().binding.Equipment_Nav.Manufacturer;
        }
    } catch (exc) {
        return '-';
    }
}
