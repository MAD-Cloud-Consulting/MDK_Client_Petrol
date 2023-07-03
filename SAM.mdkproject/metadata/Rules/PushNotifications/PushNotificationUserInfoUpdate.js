/**
* Check if there is a need to send User Info
* @param {IClientAPI} context
*/

import ApplicationSettings from '../Common/Library/ApplicationSettings';

export default function PushNotificationUserInfoUpdate(context) {
    if (!ApplicationSettings.getBoolean(context, 'didSetUserGeneralInfos', false)) {
        return context.executeAction('/SAPAssetManager/Actions/PushNotifications/PushNotificationUserInfoUpdate.action');
    }
}
