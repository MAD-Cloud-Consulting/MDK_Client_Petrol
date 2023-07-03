import libWOStatus from '../../../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import operationStatus from '../../../MobileStatus/MobileStatusLibrary';
export default function WorkOrderDetailsOnPageLoad(context) {
    // Hide the action bar based if order is complete and 
    return libWOStatus.isOrderComplete(context).then(status => {
        if (status) { 
            context.setActionBarItemVisible(0, false);
            context.setActionBarItemVisible(1, false);
            return true;
        }
        return operationStatus.isMobileStatusComplete(context,'MyWorkOrderOperations',context.binding.OrderId, context.binding.OperationNo).then(result => {
            if (result) { //already complete so exit
                context.setActionBarItemVisible(0, false);
                context.setActionBarItemVisible(1, false);
                return true;
            }
            return false;
        });
    });
}
