import validation from '../../../Common/Library/ValidationLibrary';

export default function ConnectionObjectAddress(context) {
    let addressObject = context.binding.ConnectionObject_Nav.FuncLocation_Nav.Address;
    if (addressObject) {
        var address = `${addressObject.HouseNum} ${addressObject.Street}\n${addressObject.City}, ${addressObject.Region} ${addressObject.PostalCode}\n${addressObject.Country}`;
    }
    return validation.evalIsEmpty(address);
}
