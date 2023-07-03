export default function WBSElementEditable(context) {
    let data = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().FixedData;
    let editable = true;
    if (data && data.project) {
        editable = false;
    }
    return editable;
}
