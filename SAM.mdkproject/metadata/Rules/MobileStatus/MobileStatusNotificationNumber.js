import libCom from '../Common/Library/CommonLibrary';

/**
 * Returns the notification number saved in state variable from ChangesetSwitchNotificationTaskID.js when a new notification task is created.
 * @param {*} context
 */
export default function MobileStatusNotificationNumber(context) {
    let notificationNumber = libCom.getStateVariable(context, 'NotificationNumber');
    if (notificationNumber && notificationNumber !== '') {
        return notificationNumber;
    }
    return '';
}
