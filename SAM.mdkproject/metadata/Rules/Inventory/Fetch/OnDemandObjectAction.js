/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function OnDemandObjectAction(context) {
    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().Action;
}
