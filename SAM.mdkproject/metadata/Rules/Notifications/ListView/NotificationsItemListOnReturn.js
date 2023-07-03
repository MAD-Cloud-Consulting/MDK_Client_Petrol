
import notificationItemCount from '../Item/NotificationItemsCount';

export default function NotificationsItemListOnReturn(clientAPI) {
    return notificationItemCount(clientAPI.getControls()[0]).then(count => {
        clientAPI.setCaption(clientAPI.localizeText('notification_items_x',[count]));
    });
}
