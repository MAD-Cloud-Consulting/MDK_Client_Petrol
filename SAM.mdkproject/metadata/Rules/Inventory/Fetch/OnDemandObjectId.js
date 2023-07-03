/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function OnDemandObjectId(context) {
    return context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().ObjectId;
}
