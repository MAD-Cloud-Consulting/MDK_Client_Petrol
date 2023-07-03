/**
* Initialize action on User Switch
* @param {IClientAPI} context
*/
import ApplicationSettings from '../Common/Library/ApplicationSettings';
import Logger from '../Log/Logger';
import downloadDefiningRequest from '../OData/Download/DownloadDefiningRequest';
export default function InitializeOnUserSwitch(context) {
    return context.executeAction('/SAPAssetManager/Actions/OData/ReInitializeOfflineOData.action').then( ()=> {
        return context.executeAction('/SAPAssetManager/Actions/OData/UploadOfflineData.action').then( () => {
            ApplicationSettings.setBoolean(context,'didUserSwitchDeltaCompleted', true);
            return downloadDefiningRequest(context);
        }).catch((error) => {
            Logger.error('Initialize On User Switch Failed',  error);
            ApplicationSettings.setBoolean(context,'didUserSwitchDeltaCompleted', true);
        });
    }).catch((error) => {
        Logger.error('Initialize On User Switch Failed',  error);
        ApplicationSettings.setBoolean(context,'didUserSwitchDeltaCompleted', true);
    });
}
