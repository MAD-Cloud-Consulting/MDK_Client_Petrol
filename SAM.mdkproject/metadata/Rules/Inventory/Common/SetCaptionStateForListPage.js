import libCom from '../../Common/Library/CommonLibrary';

/**
 * Saves the current global caption state variables variables to the current list page's client data
 * These should be retrieved when the list screen is returned to
 */
 
export default function SetCaptionStateForListPage(context, pageName) {

    let clientData = context.evaluateTargetPath('#Page:' + pageName + '/#ClientData');

    if (libCom.getStateVariable(context,'INVENTORY_SEARCH_FILTER_MDK')) {
        clientData.INVENTORY_SEARCH_FILTER_MDK = libCom.getStateVariable(context,'INVENTORY_SEARCH_FILTER_MDK');
    } else {
        clientData.INVENTORY_SEARCH_FILTER_MDK = '';
    }

    if (libCom.getStateVariable(context,'INVENTORY_SEARCH_FILTER')) {
        clientData.INVENTORY_SEARCH_FILTER = libCom.getStateVariable(context,'INVENTORY_SEARCH_FILTER');
    } else {
        clientData.INVENTORY_SEARCH_FILTER = '';
    }

    if (libCom.getStateVariable(context,'INVENTORY_BASE_QUERY')) {
        clientData.INVENTORY_BASE_QUERY = libCom.getStateVariable(context,'INVENTORY_BASE_QUERY');
    } else {
        clientData.INVENTORY_BASE_QUERY = '';
    }

    if (libCom.getStateVariable(context,'INVENTORY_CAPTION')) {
        clientData.INVENTORY_CAPTION = libCom.getStateVariable(context,'INVENTORY_CAPTION');
    } else {
        clientData.INVENTORY_CAPTION = '';
    }

    if (libCom.getStateVariable(context,'INVENTORY_ENTITYSET')) {
        clientData.INVENTORY_ENTITYSET = libCom.getStateVariable(context,'INVENTORY_ENTITYSET');
    } else {
        clientData.INVENTORY_ENTITYSET = '';
    }

    if (libCom.getStateVariable(context,'INVENTORY_LIST_PAGE')) {
        clientData.INVENTORY_LIST_PAGE = libCom.getStateVariable(context,'INVENTORY_LIST_PAGE');
    } else {
        clientData.INVENTORY_LIST_PAGE = '';
    }
 
}
