
export default function ConfirmationOperation(context) {
    let bindingObject = context.getBindingObject();
    let operationId = bindingObject.Operation;
    let workOrder = bindingObject.WorkOrderHeader;
    for (let operation of workOrder.Operations) {
        if (operation.OperationNo === operationId) {
            return operation;
        }
    }
    return undefined;
}
