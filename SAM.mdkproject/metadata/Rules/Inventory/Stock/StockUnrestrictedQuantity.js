import libVal from '../../Common/Library/ValidationLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function StockUnrestrictedQuantity(context) {
    if (!libVal.evalIsEmpty(context.binding.UnrestrictedQuantity) && !libVal.evalIsEmpty(context.binding.Material) && !libVal.evalIsEmpty(context.binding.Material.BaseUOM)) {
        return Number(context.binding.UnrestrictedQuantity) + ' ' + context.binding.Material.BaseUOM;
    } else if (!libVal.evalIsEmpty(context.binding.UnrestrictedQuantity)) {
        return Number(context.binding.UnrestrictedQuantity);
    } else if (!libVal.evalIsEmpty(context.binding.Material) && !libVal.evalIsEmpty(context.binding.Material.BaseUOM)) {
        return context.binding.Material.BaseUOM;
    }
    return '';
}
