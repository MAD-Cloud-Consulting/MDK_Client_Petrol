import { GlobalVar } from '../../Common/Library/GlobalCommon';
import libCom from '../../Common/Library/CommonLibrary';
import setCaption from '../Search/InventorySearchSetCaption';
import setCaptionState from '../Common/SetCaptionStateForListPage';
import checkForOnlineSearch from '../Search/CheckForOnlineSearch';

export default function GetInboundListQuery(context, queryOnly=false) {    
    let plant = GlobalVar.getUserSystemInfo().get('USER_PARAM.WRK');
    let searchString = context.searchString;
    let filter = '';
    let filters = [];
    let queryBuilder;
    let baseQuery = "((IMObject eq 'PO') or (IMObject eq 'ST' and StockTransportOrderHeader_Nav/SupplyingPlant ne '" + plant + "') or (IMObject eq 'IB') or (IMObject eq 'PRD'))";
    let expand = 'PurchaseOrderHeader_Nav,StockTransportOrderHeader_Nav,InboundDelivery_Nav';
    
    if (!plant) {
        plant = '';
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'OnDemandObjects', [], '$orderby=ObjectId').then(results => {
        if (results && results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                let row = results.getItem(i);
                if (row.Action === 'D') {
                    baseQuery = baseQuery + ` and ObjectId ne '${row.ObjectId}'`;
                }
            }
        }

        if (queryOnly) {
            return '$filter=' + baseQuery + '&$expand=' + expand + '&$orderby=ObjectId';
        }

        queryBuilder = context.dataQueryBuilder();
        libCom.setStateVariable(context,'INVENTORY_CAPTION','IB');
        libCom.setStateVariable(context,'INVENTORY_BASE_QUERY','$filter=' + baseQuery);
        libCom.setStateVariable(context,'INVENTORY_ENTITYSET','MyInventoryObjects');
        libCom.setStateVariable(context, 'INVENTORY_LIST_PAGE', 'InboundListPage');

        if (searchString) { //Supporting order number and material number for searches
            searchString = context.searchString.toLowerCase();
            filters.push(`substringof('${searchString}', tolower(ObjectId))`);
            filters.push(`substringof('${searchString}', tolower(PurchaseOrderHeader_Nav/SupplyingPlant))`);
            filters.push(`substringof('${searchString}', tolower(PurchaseOrderHeader_Nav/Vendor_Nav/Name1))`);
            filters.push(`PurchaseOrderHeader_Nav/PurchaseOrderItem_Nav/any(wp : substringof('${searchString}', tolower(wp/MaterialNum)))`);
            filters.push(`substringof('${searchString}', tolower(StockTransportOrderHeader_Nav/SupplyingPlant))`);
            filters.push(`substringof('${searchString}', tolower(StockTransportOrderHeader_Nav/Vendor_Nav/Name1))`);
            filters.push(`StockTransportOrderHeader_Nav/StockTransportOrderItem_Nav/any(wp : substringof('${searchString}', tolower(wp/MaterialNum)))`);
            filters.push(`InboundDelivery_Nav/Items_Nav/any(wp : substringof('${searchString}', tolower(wp/Material)))`);
        }
        if (filters.length > 0) {
            filter = baseQuery + ' and (' + filters.join(' or ') + ')';
        } else {
            filter = baseQuery;
        }
        queryBuilder.filter(filter);
        queryBuilder.expand(expand);
        queryBuilder.orderBy('ObjectId');
        libCom.setStateVariable(context,'INVENTORY_SEARCH_FILTER',filter);

        setCaptionState(context, 'InboundListPage'); //Save caption state for this list page

        //If this script was called because a filter was just applied, do not run setCaption here
        if (!libCom.getStateVariable(context, 'INVENTORY_SEARCH_FILTER_APPLIED')) {
            return setCaption(context).then(() => {
                return checkForOnlineSearch(context, 'MyInventoryObjects', queryBuilder, searchString, 'IB');
            });
        }
        libCom.removeStateVariable(context, 'INVENTORY_SEARCH_FILTER_APPLIED');
        return checkForOnlineSearch(context, 'MyInventoryObjects', queryBuilder, searchString, 'IB');
    });
}
