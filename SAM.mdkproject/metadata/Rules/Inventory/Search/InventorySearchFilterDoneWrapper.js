import libCommon from '../../Common/Library/CommonLibrary';
import filterDone from '../../Filter/FilterDone';

export default function InventorySearchFilterDoneWrapper(context) {
    libCommon.setStateVariable(context, 'INVENTORY_SEARCH_FILTER_APPLIED', true); //Set state variable to handle list count logic during filter
    filterDone(context);    
}
