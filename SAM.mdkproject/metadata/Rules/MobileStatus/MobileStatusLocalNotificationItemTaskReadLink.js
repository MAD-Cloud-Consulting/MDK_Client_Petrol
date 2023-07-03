/**
* Describe this function...
* @param {IClientAPI} context
*/
import libCom from '../Common/Library/CommonLibrary';

export default function MobileStatusLocalItemTaskReadLink(context) {
    //return the local notification item task id state variable set in rule GenerateNotificationID.js when a new notification is created.
    let task = libCom.getStateVariable(context, 'Task');
    let item = libCom.getStateVariable(context, 'Item');
    let notif = libCom.getStateVariable(context, 'Notification');
    return `MyNotificationItemTasks(ItemNumber='${item}',NotificationNumber='${notif}',TaskSequenceNumber='${task}')`;
}
