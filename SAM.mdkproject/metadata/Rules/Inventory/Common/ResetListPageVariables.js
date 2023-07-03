import libCom from '../../Common/Library/CommonLibrary';

/**
 * Remove state variables when navigating to a new list page
 * @param {*} context 
 */
export default function ResetListPageVariables(context) {
    libCom.removeStateVariable(context,'INVENTORY_SEARCH_FILTER_MDK');
    libCom.removeStateVariable(context,'INVENTORY_SEARCH_FILTER');
    libCom.removeStateVariable(context,'INVENTORY_SEARCH_FILTER_APPLIED');
}
