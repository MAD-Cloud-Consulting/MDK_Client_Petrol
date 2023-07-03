import libVal from '../../Common/Library/ValidationLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function StockNumberAndDescription(context) {
    if (!libVal.evalIsEmpty(context.binding.Material) && !libVal.evalIsEmpty(context.binding.Material.Description)) {
        return context.binding.MaterialNum + ' - ' + context.binding.Material.Description;
    } else if (!libVal.evalIsEmpty(context.binding.MaterialDesc)) {
        return context.binding.MaterialNum + ' - ' + context.binding.MaterialDesc;
    }
    return '';
}
