/**
* Describe this function...
* @param {IClientAPI} context
*/
import libCom from '../Common/Library/CommonLibrary';

export default function MobileStatusGetSavedOrderID(context) {
    let workOrderId = libCom.getStateVariable(context, 'workOrderId');
    if (workOrderId && workOrderId !== '') {
        return workOrderId;
    }
    return '';
}
