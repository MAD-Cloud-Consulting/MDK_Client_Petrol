export default function InboundOutboundDeliveryQuantity(context, item) {
    const binding = item || context.binding;
    let decimals = Number(context.getGlobalDefinition('/SAPAssetManager/Globals/Inventory/QuantityFieldDecimalPlacesAllowed.global').getValue());
    let pickedText = context.formatNumber(binding.PickedQuantity, '', {maximumFractionDigits: decimals});
    let quantityText = context.formatNumber(binding.Quantity, '', {maximumFractionDigits: decimals});

    return context.localizeText('item_open_quantities',[pickedText,quantityText,binding.UOM]);
}
