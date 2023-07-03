import libCom from '../Common/Library/CommonLibrary';
import {DeltaSyncInit} from '../Common/InitializeGlobalStates';
import CreateDefaultOverviewRowEntities from '../Confirmations/Init/CreateDefaultOverviewRowEntities';
import setSyncInProgressState from './SetSyncInProgressState';
import getPendingPushState from '../PushNotifications/GetPushNotificationsPendingState';
import setPendingPushState from '../PushNotifications/SetPushNotificationsPendingState';
import downloadPush from '../PushNotifications/PushNotificationsDownload';
import libCrew from '../Crew/CrewLibrary';
import handleDownloadSuccessForFOW from '../FOW/Sync/HandleDownloadSuccess';
import readUserFeatures from '../UserFeatures/ReadingOfflineUserFeatures';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import ApplicationSettings from '../Common/Library/ApplicationSettings';
import callRefreshAfterSync from '../Inventory/Overview/CallRefreshAfterSync';
export default function CheckForSyncErrorsAfterDownloadSuccess(context) {
    
    let promises = [];
    setSyncInProgressState(context, false);
    // If there are pending Pushes, execute those
    if (getPendingPushState(context)) {
        // If there are pending pushes then we set the "PendingPush" state to false
        // and set the "SyncInProgress" state to true again and download the Push
        setPendingPushState(context, false);
        setSyncInProgressState(context, true);
        downloadPush(context, libCom.getStateVariable(context, 'ObjectType'));
    }
   
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Crew.global').getValue())) {
        promises.push(libCrew.initializeCrewHeader(context));
    }
    return Promise.all(promises).then(() =>{
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'ErrorArchive', '').then(result => {
                if (result > 0) {
                    return context.executeAction('/SAPAssetManager/Actions/OData/ODataUploadFailureMessage.action').then(function() {
                        return Promise.reject(false);
                    });
                } else {
                    return DeltaSyncInit(context).then(() => {
                        return readUserFeatures(context).then(() => {
                            return CreateDefaultOverviewRowEntities(context).then(() => {
                                let didUserSwitchCompleted = ApplicationSettings.getBoolean(context, 'didUserSwitchDeltaCompleted');
                                if (didUserSwitchCompleted) { //stop setting the flag to true until user swtich delta is completed
                                    ApplicationSettings.setBoolean(context, 'didSetUserGeneralInfos', true); 
                                }
                                if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/FOW.global').getValue())) {
                                    handleDownloadSuccessForFOW(context);
                                }
                                context.getPageProxy().redraw();
                                return callRefreshAfterSync(context).then(() => {
                                    return context.executeAction('/SAPAssetManager/Actions/SyncSuccessMessage.action');
                                });
                            });
                        });
                    });
                }
        });
    });

}
