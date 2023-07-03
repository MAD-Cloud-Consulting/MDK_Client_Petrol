
import notificationActivityCount from '../Activity/NotificationsActivitiesCount';

export default function NotificationsActivitiesListOnReturn(clientAPI) {
    return notificationActivityCount(clientAPI.getControls()[0]).then(count => {
        clientAPI.setCaption(clientAPI.localizeText('notification_activities_x',[count]));
    });
}
