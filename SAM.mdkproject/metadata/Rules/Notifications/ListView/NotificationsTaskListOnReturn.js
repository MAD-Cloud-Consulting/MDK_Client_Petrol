
import notificationTaskCount from '../Task/NotificationsTasksCount';

export default function NotificationsItemListOnReturn(clientAPI) {
    return notificationTaskCount(clientAPI.getControls()[0]).then(count => {
        clientAPI.setCaption(clientAPI.localizeText('notification_tasks_x',[count]));
    });
}
