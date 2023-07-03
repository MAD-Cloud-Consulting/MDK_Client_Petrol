/**
* Description of the Signature File Name
* @param {IClientAPI} context
*/
export default function SignatureOnCreateFileDescription(context) {
    let previousPageClientData = context.evaluateTargetPathForAPI('#Page:-Previous').getClientData();

    if (previousPageClientData.isCustomerSignature) {
        return context.localizeText('customer_signature');
    } else {
        return context.localizeText('technician_signature');
    }
}
