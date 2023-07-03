
export default function SignatureControlCustomerNav(clientAPI) {
    clientAPI.getPageProxy().getClientData().isCustomerSignature = true;
    return clientAPI.executeAction('/SAPAssetManager/Actions/SignatureControl/View/SignatureControlView.action');
}
