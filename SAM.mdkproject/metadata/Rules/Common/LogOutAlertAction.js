/**
* Show Log out action prompot and log out the user
* @param {IClientAPI} context
*/
import Logger from '../Log/Logger';
export default function LogOutAlertAction(clientAPI) {
    const title = clientAPI.localizeText('logout_user_prompt_title');
    const message = clientAPI.localizeText('logout_user_promp_message');
    const continue_text = clientAPI.localizeText('continue_text');
    const continue_without_sync_text = clientAPI.localizeText('continue_without_sync');
    const cancelText = clientAPI.localizeText('cancel');
    return clientAPI.nativescript.uiDialogsModule.confirm({
        title: title,
        message: message,
        okButtonText: continue_text,
        cancelButtonText: continue_without_sync_text,
        neutralButtonText: cancelText,
    }).then( result => {
        if (result) { // User choose to do sync before logout
            return clientAPI.executeAction('/SAPAssetManager/Actions/UploadOnlyProgressBannerMessage.action').then(() => {
                return clientAPI.executeAction('/SAPAssetManager/Actions/LogOut/LoggingOutBannerMessage.action').catch((error) => {
                    Logger.error('Logging Out Banner Message Failure', error);
                });
            }).catch((error) => {
                Logger.error('UploadFailure', error);
                return clientAPI.executeAction('/SAPAssetManager/Actions/User/LogOutUser.action');
            });
        } else if (result === false) { // User choose to do logout without sync
            return clientAPI.executeAction('/SAPAssetManager/Actions/User/LogOutBannerMessage.action');
        }
        return undefined;
    });
}
