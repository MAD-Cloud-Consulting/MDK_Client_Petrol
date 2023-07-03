/**
* Show/Hide Notification Add popover if both edit and Work Order create is disabled based on User Authorization
* @param {IClientAPI} context
*/
import enableNotificationEdit from './EnableNotificationEdit';
import NotificationCreateWorkOrderVisible from '../../Notifications/Details/NotificationCreateWorkOrderVisible';

export default function EnableNotificationCreateEdit(context) {
    return (enableNotificationEdit(context) || NotificationCreateWorkOrderVisible(context) );
}
