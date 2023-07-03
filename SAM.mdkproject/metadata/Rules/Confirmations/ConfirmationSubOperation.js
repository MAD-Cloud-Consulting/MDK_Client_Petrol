import ConfirmationOperation from './ConfirmationOperation';

export default function ConfirmationSubOperation(context) {
    let operation = ConfirmationOperation(context);
    if (!operation) {
        return undefined;
    }
    let subOpId = context.getBindingObject().SubOperation;
    for (let subOp of operation.SubOperations) {
        if (subOp.SubOperationNo === subOpId) {
            return subOp;
        }
    }
    return undefined;
}
