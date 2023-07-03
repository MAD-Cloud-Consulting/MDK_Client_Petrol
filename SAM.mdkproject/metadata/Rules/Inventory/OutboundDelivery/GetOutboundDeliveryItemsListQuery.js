import libCom from '../../Common/Library/CommonLibrary';
import setCaption from '../Search/InventorySearchSetCaption';
import setCaptionState from '../Common/SetCaptionStateForListPage';

export default function GetOutboundDeliveryListQuery(context, queryOnly=false) {
    let searchString = context.searchString;
    let filter = '';
    let filters = [];
    let queryBuilder;

    let deliveryNum = context.binding.DeliveryNum;
    let baseQuery = "(DeliveryNum eq '" + deliveryNum + "')";
    let expand = 'OutboundDeliverySerial_Nav,MaterialPlant_Nav,OutboundDelivery_Nav';
    let orderby = 'Item';

    if (queryOnly) {
        return '$filter=' + baseQuery + '&$expand=' + expand + '&$orderby=' + orderby;
    }

    queryBuilder = context.dataQueryBuilder();
    libCom.setStateVariable(context,'INVENTORY_CAPTION','ODI');
    libCom.setStateVariable(context,'INVENTORY_BASE_QUERY','$filter=' + baseQuery);
    libCom.setStateVariable(context,'INVENTORY_ENTITYSET','OutboundDeliveryItems');
    libCom.setStateVariable(context, 'INVENTORY_LIST_PAGE', 'OutboundDeliveryItemsListPage');

    if (searchString) { //Supporting order number and material number for searches
        searchString = context.searchString.toLowerCase();
        filters.push(`substringof('${searchString}', tolower(Plant))`);
        filters.push(`substringof('${searchString}', tolower(Material))`);
        filters.push(`substringof('${searchString}', tolower(Material_Nav/Description))`);
    }
    if (filters.length > 0) {
        filter = baseQuery + ' and (' + filters.join(' or ') + ')';
    } else {
        filter = baseQuery;
    }
    queryBuilder.filter(filter);
    queryBuilder.expand(expand);
    queryBuilder.orderBy(orderby);
    libCom.setStateVariable(context,'INVENTORY_SEARCH_FILTER',filter);

    setCaptionState(context, libCom.getPageName(context)); //Save caption state for this list page

    //If this script was called because a filter was just applied, do not run setCaption here
    if (!libCom.getStateVariable(context, 'INVENTORY_SEARCH_FILTER_APPLIED')) {
        return setCaption(context).then(() => {
            return queryBuilder;
        });
    }
    libCom.removeStateVariable(context, 'INVENTORY_SEARCH_FILTER_APPLIED');

    return queryBuilder;
}
