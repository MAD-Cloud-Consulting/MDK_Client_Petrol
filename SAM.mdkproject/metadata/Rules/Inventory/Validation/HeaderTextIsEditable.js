export default function HeaderTextIsEditable(context) {
    let editable = true;
    let data = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().FixedData;
    let docId = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().ActualDocId;
    let created = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().IsAlreadyCreatedDoc;
    if (data && data.headerNote) {
        editable = false;
    }
    if (docId || created) {
        editable = false;
    }
    return editable;
}
