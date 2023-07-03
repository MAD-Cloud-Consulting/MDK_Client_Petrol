import WorkOrderCompleted from '../WorkOrders/Details/WorkOrderDetailsOnPageLoad';
import SubOperationDidHideActionItems from './SubOperationDidHideActionItems';


export default function SubOperationDetailsOnPageLoad(context) {
    
    if (SubOperationDidHideActionItems(context)) {
        return true;
    }

    // handle the action bar items visiblity based on Work Order status
    return WorkOrderCompleted(context);
}
