import validation from '../../../Common/Library/ValidationLibrary';

export default function ConnectionObjectAddressInline(context) {
    let addressObject = context.binding.ConnectionObject_Nav.FuncLocation_Nav.Address;
    var address = '';
    if (addressObject) {
        address = `${addressObject.HouseNum} ${addressObject.Street}, ${addressObject.City}, ${addressObject.Region} ${addressObject.PostalCode}`;
    }
    return validation.evalIsEmpty(address) ? '-' : address;
}
