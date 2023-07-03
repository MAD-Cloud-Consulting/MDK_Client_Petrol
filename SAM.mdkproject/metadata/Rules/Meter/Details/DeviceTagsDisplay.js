export default function DeviceTagsDisplay(context) {
    try {
        if (context.binding.Device_Nav) {
            return [`${context.getPageProxy().binding.Device_Nav.RegisterGroup_Nav.Division} - ${context.getPageProxy().binding.Device_Nav.RegisterGroup_Nav.Division_Nav.Description}`];
        } else {
            return [`${context.getPageProxy().binding.RegisterGroup_Nav.Division} - ${context.getPageProxy().binding.RegisterGroup_Nav.Division_Nav.Description}`];
        }
    } catch (exc) {
        return '-';
    }
}
