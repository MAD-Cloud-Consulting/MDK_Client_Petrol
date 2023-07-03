import NotificationTaskDetailsDidHideActionItems from './NotificationTaskDetailsDidHideActionItems';
import NotificationDetailsDidHideActionItems from '../../Details/NotificationDetailsDidHideActionItems';

export default function NotificationTaskDetailsOnPageLoad(context) {

    if (NotificationTaskDetailsDidHideActionItems(context)) {
        return true;
    }

    return NotificationDetailsDidHideActionItems(context);
}
