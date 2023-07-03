/*
Triggered when a remote notification arrived that indicates there is data to be fetched.
https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1623013-application
*/
import downloadAlert from './PushNotificationsAlertMessage';

export default function PushNotificationsContentAvailableEventHandler(clientAPI) {
    const appEventData = clientAPI.getAppEventData();
    clientAPI.setApplicationIconBadgeNumber(0);
    downloadAlert(clientAPI, appEventData);
}
