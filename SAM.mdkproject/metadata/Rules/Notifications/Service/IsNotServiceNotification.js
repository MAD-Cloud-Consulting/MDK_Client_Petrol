import NotifLib from '../NotificationLibrary';

/**
 * Checks if the binding object is not a service notification.
 * On the NotificationDetails.page, for service notifications, we don't show the malfunction section or the basic location section called NotificationLocationSection.
 * This rule is used to hide those sections when the binding object is a service notification.
 * @param {*} context
 * @returns false if binding object is a service notification. True if it's a regular notification.
 */
export default function IsNotServiceNotification(context) {
    return NotifLib.isServiceNotification(context).then(isServiceNotification => {
        return !isServiceNotification;
    });
}
