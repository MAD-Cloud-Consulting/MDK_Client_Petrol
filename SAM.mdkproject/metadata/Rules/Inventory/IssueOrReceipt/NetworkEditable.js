export default function NetworkEditable(context) {
    let data = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().FixedData;
    let editable = true;
    if (data && data.network) {
        editable = false;
    }
    return editable;
}
