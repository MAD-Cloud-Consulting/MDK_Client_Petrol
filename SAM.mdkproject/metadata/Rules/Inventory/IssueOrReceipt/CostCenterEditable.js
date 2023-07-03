export default function CostCenterEditable(context) {
    let data = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().FixedData;
    let editable = true;
    if (data && data.cost_center) {
        editable = false;
    }
    return editable;
}
