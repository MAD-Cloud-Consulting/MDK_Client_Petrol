/**
 * Returns the total count of all the warranties present in the entity set
 * @param {*} context SectionProxy object.
 * @returns {Number} Total count of Equipment Warranty objects.
 */
export default function EquipmentWarrantiesCount(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', context.getPageProxy().binding['@odata.readLink']+'/Warranties', '');
}
