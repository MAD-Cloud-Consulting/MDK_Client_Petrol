/*
Triggered when a notification is about to get presented to the app.
https://developer.apple.com/documentation/usernotifications/unusernotificationcenterdelegate/1649518-usernotificationcenter?language=swift
Payload details https://help.sap.com/doc/33c4b62fdc174d89a47d4baee3ced08a/Cloud/en-US/1a74d910d7634a43bb53a37a5060d429.html
*/
import downloadAlert from './PushNotificationsAlertMessage';

export default function PushNotificationsForegroundNotificationEventHandler(clientAPI) {
    const appEventData = clientAPI.getAppEventData();
    downloadAlert(clientAPI, appEventData);
}
