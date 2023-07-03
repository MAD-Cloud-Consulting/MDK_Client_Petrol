import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import SetCaption from './InventorySearchSetCaption';
import setCaptionState from '../Common/SetCaptionStateForListPage';

export default function InventorySearchFilter(context) {
    let oldFilter = libCom.getStateVariable(context, 'INVENTORY_SEARCH_FILTER_MDK');
    libCom.setStateVariable(context, 'INVENTORY_SEARCH_FILTER_MDK',libVal.evalIsEmpty(context.actionResults.filterResult) ? '' : context.actionResults.filterResult.data.filter);
    if (oldFilter === libCom.getStateVariable(context, 'INVENTORY_SEARCH_FILTER_MDK')) {
        libCom.removeStateVariable(context, 'INVENTORY_SEARCH_FILTER_APPLIED'); //Filter was not changed, so remove caption update defer variable
    }
    setCaptionState(context, libCom.getStateVariable(context,'INVENTORY_LIST_PAGE'));
    SetCaption(context);    
}
