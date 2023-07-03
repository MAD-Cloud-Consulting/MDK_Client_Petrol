import partLib from '../PartLibrary';

/**
 * Sets OData create links in PartCreate.action
 * @param {*} context The context proxy from which this rule is being called.
 */
export default function PartCreateUpdateSetOdataCreateLinks(context) {
    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    return partLib.partCreateUpdateSetODataValue(context, 'CreateLinks');
}
