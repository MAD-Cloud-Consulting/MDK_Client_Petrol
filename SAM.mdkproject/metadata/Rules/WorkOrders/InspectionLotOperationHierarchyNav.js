/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function InspectionLotOperationHierarchyNav(context) {
    context.binding.HC_ROOT_CHILDCOUNT = 1;
    // workaround for MDK bug
    context.getPageProxy().setActionBinding(context.binding);
    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/InspectionLotOperationHierarchy.action');
}
