import DeleteUnusedOverviewEntities from '../Confirmations/Init/DeleteUnusedOverviewEntities';
import setSyncInProgressState from '../Sync/SetSyncInProgressState';
import errorLibrary from '../Common/Library/ErrorLibrary';
import libCom from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';
import appSettings from '../Common/Library/ApplicationSettings';

export default function SyncData(clientAPI) {
    clientAPI.getClientData().Error='';
    setSyncInProgressState(clientAPI, true);
    if (!libCom.isInitialSync(clientAPI)) {
        return DeleteUnusedOverviewEntities(clientAPI).then( ()=> {
            // MDK's solution to issue https://sapjira.wdf.sap.corp/browse/ICMTANGOAMF10-9879
            errorLibrary.clearError(clientAPI);
            appSettings.remove(clientAPI, 'LocallyIntalledEquip');
            return clientAPI.executeAction('/SAPAssetManager/Actions/OData/ReInitializeOfflineOData.action').then( ()=> {
                return clientAPI.executeAction('/SAPAssetManager/Actions/OData/UploadOfflineData.action');
            }).catch((error) => {
                Logger.error('Sync fails', error);
                setSyncInProgressState(clientAPI, false);
            });
        });
    }
    return clientAPI.getDefinitionValue('/SAPAssetManager/Rules/OData/Download/DownloadDefiningRequest.js');
}
