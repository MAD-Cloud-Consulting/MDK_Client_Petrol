import libVal from '../Common/Library/ValidationLibrary';
export default function ServiceOrderQuantity(context) {
    let quantity = context.binding.Quantity;
    let quantityUOM = context.binding.QuantityUOM;
    if (!libVal.evalIsEmpty(quantity)) {
        return quantity + ' ' + quantityUOM;
    } else {
        return '-';
    }
}
