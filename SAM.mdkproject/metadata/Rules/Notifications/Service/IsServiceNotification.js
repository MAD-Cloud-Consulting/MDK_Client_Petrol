import NotifLib from '../NotificationLibrary';

/**
 * Checks if the context.binding object is a service notification.
 * @param {*} context 
 * @returns true if service notification.
 */
export default function IsServiceNotification(context) {
    return NotifLib.isServiceNotification(context).then(isServiceNotification => {
        return isServiceNotification;
    });
}
