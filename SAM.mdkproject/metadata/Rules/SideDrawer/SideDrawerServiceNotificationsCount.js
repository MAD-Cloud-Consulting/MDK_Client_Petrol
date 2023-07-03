import count from '../Notifications/NotificationsTotalCount';
import getServiceNotificationTypesQueryOption from '../Notifications/Service/ServiceNotificationTypesQueryOption';

export default function SideDrawerNotificationCount(context) {
    return getServiceNotificationTypesQueryOption(context, 'NotificationType').then(serviceNotifFilter => {
        return count(context, serviceNotifFilter).then(result => {
            return context.localizeText('service_notifications_x', [result]);
        });
    });
}
