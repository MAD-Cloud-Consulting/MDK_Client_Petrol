
import notificationItemCauseCount from '../Cause/NotificationItemCausesCount';

export default function NotificationItemCauseListOnReturn(clientAPI) {
    return notificationItemCauseCount(clientAPI.getControls()[0]).then(count => {
        clientAPI.setCaption(clientAPI.localizeText('notification_items_causes_x',[count]));
    });
}
