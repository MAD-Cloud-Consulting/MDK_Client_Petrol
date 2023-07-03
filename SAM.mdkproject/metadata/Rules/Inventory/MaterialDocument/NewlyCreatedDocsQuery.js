/**
* Returns query for item list view for single document
* Have ability to set id manually and reuse it for different cases
* @param {IClientAPI} context
* @param {String} docId
*/
export default function NewlyCreatedDocsQuery(context, docId) {
    if (docId) {
        return `$filter=AssociatedMaterialDoc/MaterialDocNumber eq '${docId}'&$expand=AssociatedMaterialDoc`;
    }
    let data = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().ActualDocId;
    return `$filter=AssociatedMaterialDoc/MaterialDocNumber eq '${data}'&$expand=AssociatedMaterialDoc`;
}
