/**
 * Create MyInventoryObject for this PI header
 * @param {*} context 
 * @returns 
 */
export default function PhysicalInventoryCloseModalOnSave(context) {
    return context.executeAction('/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryCloseModal.action');
}
