

export default function MeterAddress(context) {
    if (context.binding.Device_Nav.ConnectionObject_Nav && context.binding.Device_Nav.ConnectionObject_Nav.FuncLocation_Nav) {
        let address = context.binding.Device_Nav.ConnectionObject_Nav.FuncLocation_Nav.Address.HouseNum + ' ' + context.binding.Device_Nav.ConnectionObject_Nav.FuncLocation_Nav.Address.Street + ' ' + context.binding.Device_Nav.ConnectionObject_Nav.FuncLocation_Nav.Address.City + ' ' + context.binding.Device_Nav.ConnectionObject_Nav.FuncLocation_Nav.Address.Region + ' ' + context.binding.Device_Nav.ConnectionObject_Nav.FuncLocation_Nav.Address.PostalCode + ' ' + context.binding.Device_Nav.ConnectionObject_Nav.FuncLocation_Nav.Address.Country;
        return address;
    }
    return '-';
}
