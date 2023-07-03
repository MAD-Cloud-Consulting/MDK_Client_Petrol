
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';

export default function SubOperationPickerQueryOptions(context, orderIdParam, operationParam) {

    let orderTemp;
    let operationTemp;
    let binding = context.getBindingObject();

    orderTemp = binding.OrderID;
    operationTemp = binding.Operation;

    if (orderIdParam) {
        orderTemp = orderIdParam;
    }

    if (operationParam) {
        operationTemp = operationParam;
    }

    return MobileStatusLibrary.getQueryOptionsForCompletedStatusForSuboperations(context, orderTemp, operationTemp);
}
