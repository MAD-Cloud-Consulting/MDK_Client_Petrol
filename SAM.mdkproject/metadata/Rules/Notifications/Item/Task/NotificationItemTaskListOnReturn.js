
import notificationItemTaskCount from '../../Item/Task/NotificationItemTasksCount';

export default function NotificationItemTaskListOnReturn(clientAPI) {
    return notificationItemTaskCount(clientAPI.getControls()[0]).then(count => {
        clientAPI.setCaption(clientAPI.localizeText('notification_item_tasks_x',[count]));
    });
}
