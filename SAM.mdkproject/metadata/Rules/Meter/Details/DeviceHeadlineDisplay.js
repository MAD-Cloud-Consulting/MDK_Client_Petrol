export default function DeviceHeadlineDisplay(context) {
    try {
        if (context.getPageProxy().binding.Device_Nav) {
            return `${context.getPageProxy().binding.Device_Nav.Device} - ${context.getPageProxy().binding.Device_Nav.Equipment_Nav.EquipDesc}`;
        } else {
            return `${context.getPageProxy().binding.Device} - ${context.getPageProxy().binding.Equipment_Nav.EquipDesc}`;
        }
    } catch (exc) {
        return '-';
    }
}
