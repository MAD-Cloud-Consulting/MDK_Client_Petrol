/**
* Describe this function...
* @param {IClientAPI} context
*/
import libCom from '../Common/Library/CommonLibrary';

export default function MobileStatusGetSavedOperationID(context) {
    let operationId = libCom.getStateVariable(context, 'operationId');
    if (operationId && operationId !== '') {
        return operationId;
    }
    return '';
}
