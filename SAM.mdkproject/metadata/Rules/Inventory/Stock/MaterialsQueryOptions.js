import libVal from '../../Common/Library/ValidationLibrary';
import EnableInventoryClerk from '../../SideDrawer/EnableInventoryClerk';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function MaterialsQueryOptions(context) {
    
    let clientData;
    if (EnableInventoryClerk(context)) {
        clientData = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData();
    } else {
        clientData = context.evaluateTargetPathForAPI('#Page:StockListViewPage').getClientData();
    }
    
    if (!libVal.evalIsEmpty(clientData.StockOnLineSearch) && clientData.StockOnLineSearch) {
        let queryBuilder = context.dataQueryBuilder();
        let stockOnLine = clientData.StockOnLine;
        
        let newFilterOpts = [];
        if (stockOnLine.Plant.length > 0) {
            let plantsQuery = [];
            for (let i in stockOnLine.Plant) {
                if (!libVal.evalIsEmpty(stockOnLine.Plant[i])) {
                    plantsQuery.push(`Plant eq '${stockOnLine.Plant[i].ReturnValue}'`);
                }
            }
            if (plantsQuery.length > 0) {
                newFilterOpts.push(`(${plantsQuery.join(' or ')})`);
            }
        }
        if (stockOnLine.StorageLocation.length > 0) {
            let storageLocationsQuery = [];
            for (let i in stockOnLine.StorageLocation) {
                if (!libVal.evalIsEmpty(stockOnLine.StorageLocation[i])) {
                    storageLocationsQuery.push(`StorageLocation eq '${stockOnLine.StorageLocation[i].ReturnValue}'`);
                }
            }
            if (storageLocationsQuery.length > 0) {
                newFilterOpts.push(`(${storageLocationsQuery.join(' or ')})`);
            }
        }

        if (!libVal.evalIsEmpty(stockOnLine.MaterialID)) {
            newFilterOpts.push(`MaterialNum eq '${stockOnLine.MaterialID}'`);
        }

        queryBuilder.filter(newFilterOpts.join(' and '));

        if (!libVal.evalIsEmpty(stockOnLine.MaterialDescription)) {
            let filters = [
                `substringof('${stockOnLine.MaterialDescription.toLowerCase()}', MaterialDesc)`,
            ];
            queryBuilder.filter().and(`${filters.join(' or ')}`);
        }
        queryBuilder.expand('Material');
        return queryBuilder;
    }

    return '$filter=false';

    



}
