export default function DeviceHeadlineDisplay(context) {
    try {
        return `${context.binding.Device_Nav.Device} - ${context.binding.Device_Nav.Equipment_Nav.EquipDesc}`;
    } catch (exc) {
        return '-';
    }
}
