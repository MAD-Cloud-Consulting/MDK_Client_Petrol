/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function GetReceiveButtonStatusInbound(context) {
    let binding = context.binding;
    let isEditable = true;
    if (binding && binding.GoodsMvtStatus === 'C') {
        isEditable = false;
    }
    return isEditable;
}
