import libCom from '../../Common/Library/CommonLibrary';
import setCaption from '../Search/InventorySearchSetCaption';
import setCaptionState from '../Common/SetCaptionStateForListPage';
import checkForOnlineSearch from '../Search/CheckForOnlineSearch';

export default function GetPhysicalListQuery(context, queryOnly=false) {
    let searchString = context.searchString;
    let filter = '';
    let filters = [];
    let queryBuilder;
    let baseQuery = "IMObject eq 'PI'";
    let expand = 'PhysicalInventoryDocHeader_Nav';

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
        libCom.setStateVariable(context,'INVENTORY_CAPTION','PI');
        libCom.setStateVariable(context,'INVENTORY_BASE_QUERY','$filter=' + baseQuery);
        libCom.setStateVariable(context,'INVENTORY_ENTITYSET','MyInventoryObjects');
        libCom.setStateVariable(context, 'INVENTORY_LIST_PAGE', 'PhysicalInventoryListPage');

        if (searchString) { //Supporting order number and material number for searches
            searchString = context.searchString.toLowerCase();
            // TODO: add more search fields there
            filters.push(`substringof('${searchString}', tolower(ObjectId))`);
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

        setCaptionState(context, 'PhysicalInventoryListPage'); //Save caption state for this list page

        //If this script was called because a filter was just applied, do not run setCaption here
        if (!libCom.getStateVariable(context, 'INVENTORY_SEARCH_FILTER_APPLIED')) {
            return setCaption(context).then(() => {
                return checkForOnlineSearch(context, 'MyInventoryObjects', queryBuilder, searchString, 'PI');
            });
        }
        libCom.removeStateVariable(context, 'INVENTORY_SEARCH_FILTER_APPLIED');
        return checkForOnlineSearch(context, 'MyInventoryObjects', queryBuilder, searchString, 'PI');
    });

}
