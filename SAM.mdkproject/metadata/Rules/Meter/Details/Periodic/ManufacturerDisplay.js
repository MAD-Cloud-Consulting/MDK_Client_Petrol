export default function ManufacturerDisplay(context) {
    try {
        return context.getPageProxy().binding.Device_Nav.Equipment_Nav.Manufacturer;
    } catch (exc) {
        return '-';
    }
}
