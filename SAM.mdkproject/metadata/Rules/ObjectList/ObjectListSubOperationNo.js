import libVal from '../Common/Library/ValidationLibrary';
/**
* Returns the sub-operation number if the binding object is a sub-operation; otherwise it returns a blank.
* Used by ObjectListCreateNotificationForOperation.action.
* Returns 0 on error.
* @param {IClientAPI} context - Binding object is Operation or SubOperation.
*/
export default function ObjectListSubOperationNo(context) {
    let bindingObj = context.binding;
    if (!libVal.evalIsEmpty(bindingObj)) {
        if (bindingObj['@odata.type'] === '#sap_mobile.MyWorkOrderSubOperation') {
            return bindingObj.SubOperationNo;
        }
    }
    return '';
}
