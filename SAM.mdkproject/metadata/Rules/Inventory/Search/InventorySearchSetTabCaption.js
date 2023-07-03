import libCom from '../../Common/Library/CommonLibrary';

export default async function InventorySearchSetTabCaption(context) {

    //const delay = ms => new Promise(res => setTimeout(res, ms));
    //await delay(200);

    let pageName = libCom.getPageName(context);

    let queryOption;
    let mdkFilterText = libCom.getStateVariable(context,'INVENTORY_SEARCH_FILTER_MDK', pageName);
    let filterText = libCom.getStateVariable(context,'INVENTORY_SEARCH_FILTER', pageName);
    let baseQuery = libCom.getStateVariable(context,'INVENTORY_BASE_QUERY', pageName);
    let type = libCom.getStateVariable(context,'INVENTORY_CAPTION', pageName);
    let entitySet = libCom.getStateVariable(context,'INVENTORY_ENTITYSET', pageName);

    if (mdkFilterText && mdkFilterText !== '$filter=') {
        queryOption = mdkFilterText; //Inject mdk filter only
    }

    if (queryOption) { //MDK filter exists
        if (filterText) { //Add the base query filter to MDK
            queryOption += ' and ' + filterText;
        }
    } else {
        if (filterText) { //No MDK filter, only base filter
            queryOption = '$filter=' + filterText;
        }
    }

    var params = [];
    let totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', entitySet, baseQuery);
    let countPromise = context.count('/SAPAssetManager/Services/AssetManager.service', entitySet, queryOption);

    return Promise.all([totalCountPromise, countPromise]).then(function(resultsArray) {
        let totalCount = resultsArray[0];
        let count = resultsArray[1];
        params.push(count);
        params.push(totalCount);
        if (typeof context.getPageProxy === 'function') {
            context = context.getPageProxy();
        }

        if (type === 'PI') { //Physical Inventory Items list
            if (count === totalCount) {
                return context.localizeText('items') + ' (' + totalCount.toString() + ')';
            }
            return context.localizeText('items') + ' (' + count.toString() + '/' + totalCount.toString() + ')';
        }
        return '';
    });
}

