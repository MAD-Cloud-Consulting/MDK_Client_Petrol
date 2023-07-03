export default function MaterialEmptyBindingIfRequired(context) {
    let created = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().IsAlreadyCreatedDoc;
    if (created) {
        context.getPageProxy().setActionBinding({});
    }
    return context.executeAction('/SAPAssetManager/Actions/Inventory/MaterialDocument/MaterialDocumentModalListNav.action');
}
