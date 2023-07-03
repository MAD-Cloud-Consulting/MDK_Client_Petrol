/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function WorkOrderListPickerIsVisible(context) {
    if (context.binding &&  context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
        return false;
    } else if (context.binding &&  context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation') {
        return false;
    }
    return true;
}
