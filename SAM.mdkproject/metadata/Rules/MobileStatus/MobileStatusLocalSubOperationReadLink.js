/**
* Describe this function...
* @param {IClientAPI} context
*/
import libCom from '../Common/Library/CommonLibrary';

export default function MobileStatusLocalSubOperationReadLink(context) {
    let localSubOperationId = libCom.getStateVariable(context, 'localSubOperationId');
    let operationId = libCom.getStateVariable(context, 'operationId');
    let workOrderId = libCom.getStateVariable(context, 'workOrderId');
    return "MyWorkOrderSubOperations(OperationNo='" + operationId
        + "',OrderId='" + workOrderId + "',SubOperationNo='" + localSubOperationId + "')";
}
