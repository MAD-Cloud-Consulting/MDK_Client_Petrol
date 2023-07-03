import libCom from '../../Common/Library/CommonLibrary';

export default function InventorySearchSetCaption(context) {
    let queryOption;
    let mdkFilterText = libCom.getStateVariable(context,'INVENTORY_SEARCH_FILTER_MDK');
    let filterText = libCom.getStateVariable(context,'INVENTORY_SEARCH_FILTER');
    let baseQuery = libCom.getStateVariable(context,'INVENTORY_BASE_QUERY');
    let type = libCom.getStateVariable(context,'INVENTORY_CAPTION');
    let entitySet = libCom.getStateVariable(context,'INVENTORY_ENTITYSET');

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

        //Change these next release to use translation captions for right to left languages
        if (type === 'IB') { //Inbound list
            if (count === totalCount) {
                return context.setCaption(context.localizeText('inbound_list_title') + ' (' + totalCount.toString() + ')');
            }
            return context.setCaption(context.localizeText('inbound_list_title') + ' (' + count.toString() + '/' + totalCount.toString() + ')');
        } else  if (type === 'OB') { //Outbound list
            if (count === totalCount) {
                return context.setCaption(context.localizeText('outbound_list_title') + ' (' + totalCount.toString() + ')');
            }
            return context.setCaption(context.localizeText('outbound_list_title') + ' (' + count.toString() + '/' + totalCount.toString() + ')');        
        } else if (type === 'SEARCH') { //Search list
            if (count === totalCount) {
                return context.setCaption(context.localizeText('documents_x', [totalCount]));
            }
            return context.setCaption(context.localizeText('documents_x_x', params));
        } else if (type === 'PO' || type === 'STO' || type === 'RES' || type === 'PRD' || type === 'IDI' || type === 'ODI') { //item list pages
            if (count === totalCount) {
                return context.setCaption(context.localizeText('items') + ' (' + totalCount.toString() + ')');
            }
            return context.setCaption(context.localizeText('items') + ' (' + count.toString() + '/' + totalCount.toString() + ')');
        } else  if (type === 'IBOB') { //All documents
            if (count === totalCount) {
                return context.setCaption(context.localizeText('all_documents_list_title') + ' (' + totalCount.toString() + ')');
            }
            return context.setCaption(context.localizeText('all_documents_list_title') + ' (' + count.toString() + '/' + totalCount.toString() + ')'); 
        }
        return '';
    });
}

