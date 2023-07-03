import libVal from '../Common/Library/ValidationLibrary';
import libCommon from '../Common/Library/CommonLibrary';
import WorkOrderListSetCaption from './WorkOrderListViewSetCaption';

export default function WorkOrderListViewFilter(context) {
    libCommon.setStateVariable(context, 'WORKORDER_FILTER',libVal.evalIsEmpty(context.actionResults.filterResult) ? '' : context.actionResults.filterResult.data.filter);
    
    WorkOrderListSetCaption(context);
    
}
