export default function MaterialDocItemDelete(context) {
    context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().NotClosePage = true;
    return context.executeAction('/SAPAssetManager/Actions/Inventory/MaterialDocumentItem/MaterialDocItemDelete.action');
}
