/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function OnDemandObjectType(context) {
    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().ObjectType;
}
