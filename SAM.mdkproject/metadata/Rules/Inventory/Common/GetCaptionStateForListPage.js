import libCom from '../../Common/Library/CommonLibrary';

/**
 * Gets the saved list caption variables from client state on the current list page
 * Apply these values to global state variables used to handle caption counts
 */
 
export default function GetCaptionStateForListPage(context, pageName) {

    let clientData = context.evaluateTargetPath('#Page:' + pageName + '/#ClientData');

    if (clientData.INVENTORY_SEARCH_FILTER_MDK) {
        libCom.setStateVariable(context,'INVENTORY_SEARCH_FILTER_MDK', clientData.INVENTORY_SEARCH_FILTER_MDK);
    } else {
        libCom.setStateVariable(context,'INVENTORY_SEARCH_FILTER_MDK', '');
    }
    
    if (clientData.INVENTORY_SEARCH_FILTER) {
        libCom.setStateVariable(context,'INVENTORY_SEARCH_FILTER', clientData.INVENTORY_SEARCH_FILTER);
    } else {
        libCom.setStateVariable(context,'INVENTORY_SEARCH_FILTER', '');
    }

    if (clientData.INVENTORY_BASE_QUERY) {
        libCom.setStateVariable(context,'INVENTORY_BASE_QUERY', clientData.INVENTORY_BASE_QUERY);
    } else {
        libCom.setStateVariable(context,'INVENTORY_BASE_QUERY', '');
    }

    if (clientData.INVENTORY_CAPTION) {
        libCom.setStateVariable(context,'INVENTORY_CAPTION', clientData.INVENTORY_CAPTION);
    } else {
        libCom.setStateVariable(context,'INVENTORY_CAPTION', '');
    }

    if (clientData.INVENTORY_ENTITYSET) {
        libCom.setStateVariable(context,'INVENTORY_ENTITYSET', clientData.INVENTORY_ENTITYSET);
    } else {
        libCom.setStateVariable(context,'INVENTORY_ENTITYSET', '');
    }

    if (clientData.INVENTORY_LIST_PAGE) {
        libCom.setStateVariable(context,'INVENTORY_LIST_PAGE', clientData.INVENTORY_LIST_PAGE);
    } else {
        libCom.setStateVariable(context,'INVENTORY_LIST_PAGE', '');
    }

}
