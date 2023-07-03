/**
* Clear Validation on Value Change
* @param {IClientAPI} context
*/
export default function OnValueChange(context) {
    context.clearValidationOnValueChange();
    return context.executeAction('/SAPAssetManager/Actions/SignatureControl/Create/SignatureCreateToastMessage.action');
}
