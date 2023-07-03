export default function FormatInventoryNumber(context) {
    return context.binding.InventoryNumber !== '' ? context.binding.InventoryNumber : '-';
}
