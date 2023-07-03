import libCom from '../../Common/Library/CommonLibrary';

export default function PhysicalInventoryItemsCountedListQuery(context, queryOnly=false) {

    let binding = context.binding;

    let select = '*,MaterialSLoc_Nav/StorageBin,MaterialPlant_Nav/SerialNumberProfile,Material_Nav/Description';
    let baseQuery = "(PhysInvDoc eq '" + binding.PhysInvDoc + "' and FiscalYear eq '" + binding.FiscalYear + "' and (EntryQuantity gt 0 or ZeroCount eq 'X'))";
    let expand = 'MaterialPlant_Nav,MaterialSLoc_Nav,Material_Nav,PhysicalInventoryDocItemSerial_Nav';
    let orderBy = 'Item';
    let searchString = context.searchString;
    let filter = '';
    let filters = [];
    let queryBuilder;
    let pageName = 'PhysicalInventoryItemsCountedListPage';

    if (queryOnly) {
        return '$select=' + select + '&$filter=' + baseQuery + '&$expand=' + expand + '&$orderby=' + orderBy;
    }

    queryBuilder = context.dataQueryBuilder();
    libCom.setStateVariable(context,'INVENTORY_CAPTION','PI', pageName);
    libCom.setStateVariable(context,'INVENTORY_BASE_QUERY','$filter=' + baseQuery, pageName);
    libCom.setStateVariable(context,'INVENTORY_ENTITYSET','PhysicalInventoryDocItems', pageName);
    libCom.setStateVariable(context, 'INVENTORY_LIST_PAGE', 'PhysicalInventoryItemsCountedListPage', pageName);

    if (searchString) { //Supporting order number and material number for searches
        searchString = context.searchString.toLowerCase();
        filters.push(`substringof('${searchString}', tolower(MaterialSLoc_Nav/StorageBin))`);
        filters.push(`substringof('${searchString}', tolower(Material))`);
        filters.push(`substringof('${searchString}', tolower(Batch))`);
        filters.push(`substringof('${searchString}', tolower(Material_Nav/Description))`);
    }
    if (filters.length > 0) {
        filter = baseQuery + ' and (' + filters.join(' or ') + ')';
    } else {
        filter = baseQuery;
    }
    queryBuilder.filter(filter);
    queryBuilder.expand(expand);
    queryBuilder.orderBy(orderBy);
    libCom.setStateVariable(context,'INVENTORY_SEARCH_FILTER',filter, pageName);
    libCom.removeStateVariable(context, 'INVENTORY_SEARCH_FILTER_APPLIED');
    return queryBuilder;
   
}
