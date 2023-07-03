export default function OrderEditable(context) {
    let data = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().FixedData;
    let editable = true;
    if (data && data.order) {
        editable = false;
    }
    return editable;
}
