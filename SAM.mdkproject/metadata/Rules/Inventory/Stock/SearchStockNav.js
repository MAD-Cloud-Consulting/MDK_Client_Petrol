import libVal from '../../Common/Library/ValidationLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/

export default function SearchStockNav(context) {
    let clientData = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData();
    if (!libVal.evalIsEmpty(clientData.StockOnLineSearch) && clientData.StockOnLineSearch) {
        context.setActionBarItemVisible(1, false);
        context.setActionBarItemVisible(0, true);
        context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().StockOnLineSearch=false;
        let stocksListOfflineSection = context.evaluateTargetPathForAPI('#Page:StockListViewPage').getControls()[0].getSections()[0];
        let stocksListOnlineSection = context.evaluateTargetPathForAPI('#Page:StockListViewPage').getControls()[0].getSections()[1];
        return stocksListOfflineSection.setVisible(true).then(function() {
            return stocksListOnlineSection.setVisible(false).then(function() {
                return true;
            });
        });
    }
}
