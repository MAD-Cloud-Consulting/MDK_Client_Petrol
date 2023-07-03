export default function MetersCreateUpdateConnectionDisplay(context) {
    let address = context.binding.FuncLocation_Nav.Address;
    let result = `${address.HouseNum} ${address.Street}, ${address.City}, ${address.PostalCode}`;
    return result;
}
