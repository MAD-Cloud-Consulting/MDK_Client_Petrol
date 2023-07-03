export default function GetPhysicalInventoryItemCountQuantitiesText(context) {

    let countText, zeroCount, count;
    let binding = context.binding;
    let decimals = Number(context.getGlobalDefinition('/SAPAssetManager/Globals/Inventory/QuantityFieldDecimalPlacesAllowed.global').getValue());

    count = binding.EntryQuantity;
    countText = context.formatNumber(count, '', {maximumFractionDigits: decimals});
    zeroCount = binding.ZeroCount === 'X' ? true: false;

    if (zeroCount) { //Zero count has been checked
        return context.localizeText('pi_zero_count');
    }
    if (count > 0) { //Count exists
        return context.localizeText('pi_count_quantity',[countText,binding.EntryUOM]);
    }
    return context.localizeText('pi_uncounted');    
}
