import libVal from '../../Common/Library/ValidationLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function StockMaterialType(context) {
    if (!libVal.evalIsEmpty(context.binding.Material) && !libVal.evalIsEmpty(context.binding.Material.MaterialType)) {
        return context.binding.Material.MaterialType;
    }
    return '-';
}
