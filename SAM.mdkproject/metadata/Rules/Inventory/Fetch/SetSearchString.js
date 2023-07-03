/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function SetSearchString(context) {
    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().SearchString;
}
