import libVal from '../../Common/Library/ValidationLibrary';
import EnableInventoryClerk from '../../SideDrawer/EnableInventoryClerk';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function StockListViewOnReturning(context) {
    if (EnableInventoryClerk(context)) {
        let clientData = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData();
        if (!libVal.evalIsEmpty(clientData.StockOnLineSearch) && clientData.StockOnLineSearch) {
            context.setActionBarItemVisible(0, false);
            context.setActionBarItemVisible(1, true);
            context.setActionBarItemVisible(2, false);
        }
    }
}
