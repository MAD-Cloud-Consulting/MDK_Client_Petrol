/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function DigitalSignatureCommitFailure(context) {
    let entity = context.getClientData().entityKey;
    return context.updateProgressBanner('Signature commit failed for ' + entity);
}
