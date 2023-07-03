
import notificationListViewOnLoad from '../../Notifications/ListView/NotificationListViewOnLoad';
import notificationActivityCount from '../Activity/NotificationsActivitiesCount';

export default function NotificationsActivitiesListOnLoad(clientAPI) {
    return notificationActivityCount(clientAPI.getControls()[0]).then(count => {
        clientAPI.setCaption(clientAPI.localizeText('notification_activities_x',[count]));
        return notificationListViewOnLoad(clientAPI);
    });
}
