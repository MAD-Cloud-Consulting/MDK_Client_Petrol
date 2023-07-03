import { GlobalVar } from '../../Common/Library/GlobalCommon';
import libCom from '../../Common/Library/CommonLibrary';
import setCaption from '../Search/InventorySearchSetCaption';
import setCaptionState from '../Common/SetCaptionStateForListPage';
import checkForOnlineSearch from '../Search/CheckForOnlineSearch';

export default function GetOutboundListQuery(context, queryOnly=false) {
    let plant = GlobalVar.getUserSystemInfo().get('USER_PARAM.WRK');
    let searchString = context.searchString;
    let filter = '';
    let filters = [];
    let queryBuilder;
    let baseQuery = "((IMObject eq 'OB') or (IMObject eq 'ST' and StockTransportOrderHeader_Nav/SupplyingPlant eq '" + plant + "') or (IMObject eq 'RS') or (IMObject eq 'PRD'))";
    let expand = 'OutboundDelivery_Nav,ReservationHeader_Nav,StockTransportOrderHeader_Nav';
    
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
        libCom.setStateVariable(context,'INVENTORY_CAPTION','OB');
        libCom.setStateVariable(context,'INVENTORY_BASE_QUERY','$filter=' + baseQuery);
        libCom.setStateVariable(context,'INVENTORY_ENTITYSET','MyInventoryObjects');
        libCom.setStateVariable(context, 'INVENTORY_LIST_PAGE', 'OutboundListPage');

        if (searchString) { //Supporting order number and material number for searches
            searchString = context.searchString.toLowerCase();
            filters.push(`substringof('${searchString}', tolower(ObjectId))`);
            filters.push(`substringof('${searchString}', tolower(ReservationHeader_Nav/ReceivingPlant))`);
            filters.push(`substringof('${searchString}', tolower(ReservationHeader_Nav/OrderId))`);
            filters.push(`ReservationHeader_Nav/ReservationItem_Nav/any(wp : substringof('${searchString}', tolower(wp/MaterialNum)))`);
            filters.push(`substringof('${searchString}', tolower(StockTransportOrderHeader_Nav/SupplyingPlant))`);
            filters.push(`substringof('${searchString}', tolower(StockTransportOrderHeader_Nav/Vendor_Nav/Name1))`);
            filters.push(`StockTransportOrderHeader_Nav/StockTransportOrderItem_Nav/any(wp : substringof('${searchString}', tolower(wp/MaterialNum)))`);
            filters.push(`OutboundDelivery_Nav/Items_Nav/any(wp : substringof('${searchString}', tolower(wp/Material)))`);
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

        setCaptionState(context, 'OutboundListPage'); //Save caption state for this list page

        //If this script was called because a filter was just applied, do not run setCaption here
        if (!libCom.getStateVariable(context, 'INVENTORY_SEARCH_FILTER_APPLIED')) {
            return setCaption(context).then(() => {
                return checkForOnlineSearch(context, 'MyInventoryObjects', queryBuilder, searchString, 'OB');
            });
        }
        libCom.removeStateVariable(context, 'INVENTORY_SEARCH_FILTER_APPLIED');
        return checkForOnlineSearch(context, 'MyInventoryObjects', queryBuilder, searchString, 'OB');
    });
}
