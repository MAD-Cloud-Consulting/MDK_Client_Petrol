import NotificationDetailsDidHideActionItems from './NotificationDetailsDidHideActionItems';

// Hide the action bar based on status of the Notification and send the flag indicating if the items are visible or not
export default function NotificationDetailsOnPageLoad(context) {
    return NotificationDetailsDidHideActionItems(context);
}
