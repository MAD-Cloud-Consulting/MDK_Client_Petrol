export default function DeviceTagsDisplay(context) {
    try {
        return [`${context.getPageProxy().binding.Device_Nav.RegisterGroup_Nav.Division} - ${context.getPageProxy().binding.Device_Nav.RegisterGroup_Nav.Division_Nav.Description}`];
    } catch (exc) {
        return '-';
    }
}
