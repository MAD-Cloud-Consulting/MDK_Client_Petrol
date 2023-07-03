import isSyncInProgress from '../Sync/IsSyncInProgress';
import errorLibrary from '../Common/Library/ErrorLibrary';

// MDK's solution to issue https://sapjira.wdf.sap.corp/browse/ICMTANGOAMF10-10286
export default function ApplicationOnSync(clientAPI) {
    if (!isSyncInProgress(clientAPI)) {
        errorLibrary.clearError(clientAPI);
        return clientAPI.executeAction('/SAPAssetManager/Actions/SyncInitializeProgressBannerMessage.action');
    } else {
        return clientAPI.executeAction('/SAPAssetManager/Actions/SyncInProgress.action');
    }
}
