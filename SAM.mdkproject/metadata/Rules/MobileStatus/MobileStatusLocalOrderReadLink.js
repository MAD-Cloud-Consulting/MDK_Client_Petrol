/**
* Describe this function...
* @param {IClientAPI} context
*/
import libCom from '../Common/Library/CommonLibrary';

export default function MobileStatusLocalOrderReadLink(context) {
    //return the local work order id state variable set from WorkOrderCreate.action
    let localWorkOrderID = libCom.getStateVariable(context, 'LocalId');
    return "MyWorkOrderHeaders('" + localWorkOrderID + "')";
}
