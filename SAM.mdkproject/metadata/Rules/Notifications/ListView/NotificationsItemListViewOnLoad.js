
import notificationListViewOnLoad from '../../Notifications/ListView/NotificationListViewOnLoad';
import notificationItemCount from '../Item/NotificationItemsCount';

export default function NotificationsItemListViewOnLoad(clientAPI) {
    return notificationItemCount(clientAPI.getControls()[0]).then(count => {
        clientAPI.setCaption(clientAPI.localizeText('notification_items_x',[count]));
        return notificationListViewOnLoad(clientAPI);
    });
}
