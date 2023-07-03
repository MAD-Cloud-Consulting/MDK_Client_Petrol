import libCom from '../Common/Library/CommonLibrary';

/**
 * Returns the local notification task id saved in state variable from ChangesetSwitchNotificationTaskID.js when a new notification task is created.
 * @param {*} context
 */
export default function MobileStatusLocalNotificationTaskSeqNum(context) {
    let notificationTaskSequenceNumber = libCom.getStateVariable(context, 'NotificationTaskSequenceNumber');
    if (notificationTaskSequenceNumber && notificationTaskSequenceNumber !== '') {
        return notificationTaskSequenceNumber;
    }
    return '';
}
