import libCom from '../Common/Library/CommonLibrary';
import SignatureRunConfirmationLAM from './Create/SignatureRunConfirmationLAM';
/**
* Show prompt before Canceling the Signature Control
* @param {IClientAPI} context
*/
export default function SignatureControlCancel(context) {
    var messageText = context.localizeText('status_will_be_updated');
    var captionText = context.localizeText('warning');
    return libCom.showWarningDialog(context, messageText, captionText).then( result => {
        if (result === true) {
            context.getPageProxy().getClientData().didShowSignControl = false; // reset the flag
            return context.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action').then(() => {
                return SignatureRunConfirmationLAM(context).catch(() => {
                    // Roll back mobile status update
                    return Promise.reject();
                });	 
            }).catch(() => {
                // Roll back mobile status update
                return Promise.reject();
            });	 
        } else {
            return Promise.reject(false);
        }
    });
}
