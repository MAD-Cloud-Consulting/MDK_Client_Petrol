import EnableInventoryClerk from '../../SideDrawer/EnableInventoryClerk';
import libVal from '../../Common/Library/ValidationLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function StockSearchNav(context) {
    const isInvemtoryClerk = EnableInventoryClerk(context);
    if (isInvemtoryClerk) {
        let clientData = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData();
        if (libVal.evalIsEmpty(clientData.StockOnLineSearch)) {
            context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().StockOnLineSearch=false;
        }
    }
    return context.executeAction('/SAPAssetManager/Actions/Inventory/Stock/StockListViewNav.action');
}
