import libCommon from '../../Common/Library/CommonLibrary';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';
import Logger from '../../Log/Logger';

export default function ExpenseCreateAnotherNav(context) {
    libCommon.setOnCreateUpdateFlag(context, 'CREATE');
    if (IsCompleteAction(context)) {
        let binding = libCommon.getBindingObject(context);
        context.getPageProxy().setActionBinding(binding);
    } else {
        try {
            //Check if another expense creates from work order and set binding as work order
            let workOrderContext = context.evaluateTargetPathForAPI('#Page:WorkOrderDetailsPage');
    
            if (workOrderContext && workOrderContext.binding) {
                context.getPageProxy().setActionBinding(workOrderContext.binding);
            }
    
        } catch (error) {
            //If WorkOrderDetailsPage is not found then the user is not coming in from a work order so just move on
            Logger.error(error);
        }
    }
    return context.executeAction('/SAPAssetManager/Actions/Expense/ExpenseCreateUpdateNav.action');
}
