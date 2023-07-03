
import notificationItemActivityCount from '../Activity/CreateUpdate/NotificationItemActivitiesCount';

export default function NotificationItemActivityListOnReturn(clientAPI) {
    return notificationItemActivityCount(clientAPI.getControls()[0]).then(count => {
        clientAPI.setCaption(clientAPI.localizeText('notification_items_activities_x',[count]));
    });
}
