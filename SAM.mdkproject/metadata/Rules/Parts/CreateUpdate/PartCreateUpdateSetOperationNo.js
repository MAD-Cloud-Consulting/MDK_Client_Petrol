import partLib from '../PartLibrary';

/**
 * Sets material or text item unit of measure in PartCreate.action
 * @param {*} context The context proxy depending on where this rule is being called from.
 */
export default function PartCreateUpdateSetOperationNo(context) {
    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    return partLib.partCreateUpdateSetODataValue(context, 'OperationNo');
}
