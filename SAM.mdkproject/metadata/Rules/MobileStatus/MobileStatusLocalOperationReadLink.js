/**
* Describe this function...
* @param {IClientAPI} context
*/
import libCom from '../Common/Library/CommonLibrary';

export default function MobileStatusLocalOperationReadLink(context) {
    let lastLocalOperationId = libCom.getStateVariable(context, 'lastLocalOperationId');
    let localWorkOrderID = libCom.getStateVariable(context, 'LocalId');
    return "MyWorkOrderOperations(OrderId='" + localWorkOrderID + "',OperationNo='" + lastLocalOperationId + "')";
}

