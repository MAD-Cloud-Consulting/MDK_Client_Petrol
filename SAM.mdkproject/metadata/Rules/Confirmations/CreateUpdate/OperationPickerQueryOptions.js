
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';

export default function OperationPickerQueryOptions(context, orderIdParam) {

    let orderTemp;
    let binding = context.getBindingObject();

    orderTemp = binding.OrderID;

    if (orderIdParam) {
        orderTemp = orderIdParam;
    }

    return MobileStatusLibrary.getQueryOptionsForCompletedStatusForOperations(context, orderTemp);
}
