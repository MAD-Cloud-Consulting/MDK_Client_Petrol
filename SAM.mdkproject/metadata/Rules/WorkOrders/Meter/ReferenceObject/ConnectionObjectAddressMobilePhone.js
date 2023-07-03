

export default function ConnectionObjectAddressMobilePhone(context) {
    try {
        let address = context.binding.ConnectionObject_Nav.FuncLocation_Nav.Address.AddressCommunication;
        return address[0].TelNumber;
    } catch (exc) {
        return '-';
    }
}
