/*
Called to let your app know which action was selected by the user for a given notification.
https://developer.apple.com/documentation/usernotifications/unusernotificationcenterdelegate/1649501-usernotificationcenter
*/
import downloadAlert from './PushNotificationsAlertMessage';

export default function PushNotificationsReceiveNotificationResponseEventHandler(clientAPI) {
    const appEventData = clientAPI.getAppEventData();
    clientAPI.setApplicationIconBadgeNumber(0);
    downloadAlert(clientAPI, appEventData);
}
