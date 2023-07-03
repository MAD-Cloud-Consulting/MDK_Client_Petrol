import libVal from '../../Common/Library/ValidationLibrary';
/**
* Return a array with all the details of ID's from child to the parent
* @param {IClientAPI} context
*/
export default function SignatureObjectDetails(context) {
    let objectDetails = [];
    let binding = context.binding;
    if (libVal.evalIsEmpty(binding['@odata.type']) && !libVal.evalIsEmpty(binding.WorkOrderHeader)) {
        binding = binding.WorkOrderHeader;
    }
    switch (binding['@odata.type']) {
        case '#sap_mobile.MyWorkOrderHeader': {
            objectDetails.push(binding.OrderId);
            if (!libVal.evalIsEmpty(binding.OperationNo)) {
                objectDetails.push(binding.OperationNo);
            } 
            if (!libVal.evalIsEmpty(binding.SubOperationNo)) {
                objectDetails.push(binding.SubOperationNo);
            }
            break;
        }
        case '#sap_mobile.MyWorkOrderOperation': {
            objectDetails.push(binding.OrderId || binding.WOHeader.OrderId);
            objectDetails.push(binding.OperationNo);
            break;
        }
        case '#sap_mobile.MyWorkOrderSubOperation': {
            let operationData = binding.WorkOrderOperation;
            let operationId = operationData ? operationData.OperationNo : binding.OperationNo;
            let orderId = operationData && operationData.WOHeader ? operationData.WOHeader.OrderId : binding.OrderId;
            objectDetails.push(orderId);
            objectDetails.push(operationId);
            objectDetails.push(binding.SubOperationNo);
            break;
        }
    }
    return 'ID-' + objectDetails.join('-');
}
