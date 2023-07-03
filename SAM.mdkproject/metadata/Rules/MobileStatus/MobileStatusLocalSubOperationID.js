/**
* Describe this function...
* @param {IClientAPI} context
*/
import libCom from '../Common/Library/CommonLibrary';

export default function MobileStatusLocalSubOperationID(context) {
    //return the local sub-operation id state variable set in rule SubOperationLocalID.js when a new sub-operation is created.
    let localSubOperationId = libCom.getStateVariable(context, 'localSubOperationId');
    if (localSubOperationId && localSubOperationId !== '') {
        return localSubOperationId;
    }
    return '';
}
