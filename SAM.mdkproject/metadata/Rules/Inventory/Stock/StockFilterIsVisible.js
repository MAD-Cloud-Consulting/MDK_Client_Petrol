import libVal from '../../Common/Library/ValidationLibrary';
import EnableMultipleTechnician from '../../SideDrawer/EnableMultipleTechnician';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function StockFilterIsVisible(context) {
    let isMultipleTechnician = EnableMultipleTechnician(context);

    if (isMultipleTechnician) {
        return true;
    }

    let clientData = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData();

    if (!libVal.evalIsEmpty(clientData.StockOnLineSearch) && clientData.StockOnLineSearch) {
        return false;
    }
    return true;
}
