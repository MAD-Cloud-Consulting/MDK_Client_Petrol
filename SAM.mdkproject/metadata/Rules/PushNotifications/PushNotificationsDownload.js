import Logger from '../Log/Logger';
import setSyncInProgressState from '../Sync/SetSyncInProgressState';
import allSyncronizationGroups from '../OData/DefiningRequests/AllSyncronizationGroups';

export default function PushNotificationsDownload(context,ObjectType) {
    if (ObjectType === 'WorkOrder' || ObjectType === 'Notification') {
        return context.executeAction('/SAPAssetManager/Actions/PushNotifications/PushNotificationsDownloadInProgress.action').then(() => {
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/PushNotifications/PushNotificationsDownload.action',
                'Properties': {
                    'DefiningRequests': allSyncronizationGroups(context),
                    'OnSuccess': '/SAPAssetManager/Rules/PushNotifications/PushNotificationsDownloadSuccessAlertMessage.js',
                    'OnFailure': '/SAPAssetManager/Rules/PushNotifications/PushNotificationsDownloadFailureAlertMessage.js',
                },
            });
        });
    } else {
        // If there are errors, set the sync in progress to false
        setSyncInProgressState(context, false);
        Logger.info(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPushNotification.global').getValue() , 'Push is not implemented for ' + ObjectType + ' entity set');
    }
   
}
