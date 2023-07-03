import EnableInventoryClerk from './EnableInventoryClerk';

/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function SideDrawerStockLookUp(clientAPI) {
    if (EnableInventoryClerk(clientAPI)) {
        return clientAPI.localizeText('stock_lookup');
    } else {
        return clientAPI.localizeText('vehicle_stock_lookup');
    }
}
