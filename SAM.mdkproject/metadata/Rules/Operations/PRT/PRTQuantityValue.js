import libVal from '../../Common/Library/ValidationLibrary';

/**
 * Returns the total count of work order Quantity objects for an asset.
 * @param {*} context SectionProxy object.
 * @returns {Number} Total count of PRT Quantity
 */
export default function PRTQuantityValue(context) {
    if (!libVal.evalIsEmpty(context.binding.Quantity) && !libVal.evalIsEmpty(context.binding.QuantityUOM)) {
        return context.binding.Quantity + ' ' + context.binding.QuantityUOM;
    } else if (!libVal.evalIsEmpty(context.binding.Quantity)) {
        return context.binding.Quantity;
    } else {
        return '-';
    }
}
