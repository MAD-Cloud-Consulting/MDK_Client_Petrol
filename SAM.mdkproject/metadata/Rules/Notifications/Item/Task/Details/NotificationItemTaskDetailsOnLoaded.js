import NotificationItemTaskDetailsDidHideActionItems from './NotificationItemTaskDetailsDidHideActionItems';

import NotificationDetailsDidHideActionItems from '../../../Details/NotificationDetailsDidHideActionItems';


export default function NotificationItemTaskDetailsOnLoaded(context) {

    if (NotificationItemTaskDetailsDidHideActionItems(context)) {
        return true;
    }

    return NotificationDetailsDidHideActionItems(context);
}
