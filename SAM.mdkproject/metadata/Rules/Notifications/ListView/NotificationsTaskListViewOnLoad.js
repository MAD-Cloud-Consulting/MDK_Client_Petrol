
import notificationListViewOnLoad from '../../Notifications/ListView/NotificationListViewOnLoad';
import notificationTaskCount from '../Task/NotificationsTasksCount';

export default function NotificationListViewOnLoad(clientAPI) {
    return notificationTaskCount(clientAPI.getControls()[0]).then(count => {
        clientAPI.setCaption(clientAPI.localizeText('notification_tasks_x',[count]));
        return notificationListViewOnLoad(clientAPI);
    });
}
