export default function RegisterGroupDisplay(context) {
    try {
        if (context.getPageProxy().binding.Device_Nav) {
            return context.getPageProxy().binding.Device_Nav.RegisterGroup_Nav.RegisterInfo;
        } else {
            return context.getPageProxy().binding.RegisterGroup_Nav.RegisterInfo;
        }
    } catch (exc) {
        return '-';
    }
}
