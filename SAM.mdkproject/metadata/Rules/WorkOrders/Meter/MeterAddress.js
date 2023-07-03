export default function MeterAddress(context) {
    if (context.binding.ConnectionObject_Nav && context.binding.ConnectionObject_Nav.FuncLocation_Nav) {
        let address = context.binding.ConnectionObject_Nav.FuncLocation_Nav.Address.HouseNum + ' ' + context.binding.ConnectionObject_Nav.FuncLocation_Nav.Address.Street + ' ' + context.binding.ConnectionObject_Nav.FuncLocation_Nav.Address.City + ' ' + context.binding.ConnectionObject_Nav.FuncLocation_Nav.Address.Region + ' ' + context.binding.ConnectionObject_Nav.FuncLocation_Nav.Address.PostalCode + ' ' + context.binding.ConnectionObject_Nav.FuncLocation_Nav.Address.Country;
        return address;
    } else if (context.getPageProxy) {
        let address = context.getPageProxy().binding.ConnectionObject_Nav.FuncLocation_Nav.Address.HouseNum + ' ' + context.getPageProxy().binding.ConnectionObject_Nav.FuncLocation_Nav.Address.Street + ' ' + context.getPageProxy().binding.ConnectionObject_Nav.FuncLocation_Nav.Address.City + ' ' + context.getPageProxy().binding.ConnectionObject_Nav.FuncLocation_Nav.Address.Region + ' ' + context.getPageProxy().binding.ConnectionObject_Nav.FuncLocation_Nav.Address.PostalCode + ' ' + context.getPageProxy().binding.ConnectionObject_Nav.FuncLocation_Nav.Address.Country;
        return address;
    } else {
        return '';
    }
}
