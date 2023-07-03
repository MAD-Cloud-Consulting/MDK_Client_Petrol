import libVal from '../../Common/Library/ValidationLibrary';

/**
 * Returns the total count of work order history objects for an asset.
 * @param {*} context SectionProxy object.
 * @returns {Number} Total count of Workorder history objects.
 */
export default function PRTDescriptionValue(context) {
    if (!libVal.evalIsEmpty(context.binding.Description)) {
        return context.binding.Description;
    } else {
        return '-';
    }
}
