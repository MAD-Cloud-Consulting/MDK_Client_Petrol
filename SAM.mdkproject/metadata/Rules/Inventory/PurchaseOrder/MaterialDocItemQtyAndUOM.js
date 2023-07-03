export default function MaterialDocItemQtyAndUOM(context) {
    let qtyAndUOMStr = '';
    const binding = context.binding;
    if (binding) {
        return binding.EntryQuantity + ' ' + binding.EntryUOM;
    }
    return qtyAndUOMStr;
}
