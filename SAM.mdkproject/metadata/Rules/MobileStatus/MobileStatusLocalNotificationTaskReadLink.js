/**
* //return the local notification id state variable set in rule GenerateNotificationID.js when a new notification is created.
*/
import libCom from '../Common/Library/CommonLibrary';

export default function MobileStatusLocalNotificationTaskReadLink(context) {
    let notificationTaskSequenceNumber = libCom.getStateVariable(context, 'NotificationTaskSequenceNumber');
    let notificationNumber = libCom.getStateVariable(context, 'NotificationNumber');
    return "MyNotificationTasks(NotificationNumber='" + notificationNumber + "',TaskSequenceNumber='" + notificationTaskSequenceNumber + "')";
}
