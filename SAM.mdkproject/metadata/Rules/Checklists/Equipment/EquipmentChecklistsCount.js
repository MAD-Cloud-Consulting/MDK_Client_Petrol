/**
 * Returns the total count of all the checklists present in the entity set
 * @param {*} context SectionProxy object.
 * @returns {Number} Total count of checklist objects.
 */
export default function EquipmentChecklistsCount(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'Forms', `$filter=ChecklistBusObjects_Nav/any(cbo : cbo/Equipment_Nav/EquipId eq '${context.getPageProxy().binding.EquipId}')`);
}
