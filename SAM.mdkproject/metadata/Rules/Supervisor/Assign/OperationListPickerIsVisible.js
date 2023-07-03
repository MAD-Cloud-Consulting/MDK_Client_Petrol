/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function OperationListPickerIsVisible(context) {
    if (context.binding &&  context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        return false;
    }
    return true;
}
