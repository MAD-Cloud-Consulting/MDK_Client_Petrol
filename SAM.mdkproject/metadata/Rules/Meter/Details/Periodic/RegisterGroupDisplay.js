export default function RegisterGroupDisplay(context) {
    try {
        return context.getPageProxy().binding.Device_Nav.RegisterGroup_Nav.RegisterInfo;
    } catch (exc) {
        return '-';
    }
}
