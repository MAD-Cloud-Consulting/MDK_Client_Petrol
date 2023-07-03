import commonLib from '../../Common/Library/CommonLibrary';
export default function ConfirmationOperationDescription(context) {

    let binding = context.getBindingObject();
    const mileageActivityType = commonLib.getMileageActivityType(context);

    if (binding.Operation.length === 0) {
        return '-';
    }

    let isSubOperation = (binding.SubOperation && binding.SubOperation.length > 0);
    let entitySet;
    let filter = `$filter=OrderId eq '${binding.OrderID}' and OperationNo eq '${binding.Operation}'`;
    if (isSubOperation) {
        entitySet = 'MyWorkOrderSubOperations';
        filter += `and SubOperationNo eq '${binding.SubOperation}'`;
        filter += '&$expand=WorkOrderOperation';
    } else {
        entitySet = 'MyWorkOrderOperations';
    }

    filter += '&$top=1';
    
    return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], filter).then(result => {
        if (!result || result.length === 0) {
            return '-';
        }
        let operation = result.getItem(0);
        let description = operation.OperationShortText;
        if (mileageActivityType && mileageActivityType === binding.ActivityType) {
            description = `${description} (${binding.Operation})`; 
        }

        if (isSubOperation) {
            description = `${operation.WorkOrderOperation.OperationShortText}/ ${description}`;
        }

        return description;
    });

} 
