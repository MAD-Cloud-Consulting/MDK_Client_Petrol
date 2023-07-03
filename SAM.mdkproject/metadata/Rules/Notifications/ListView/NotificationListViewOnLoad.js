
import libNotifStatus from '../MobileStatus/NotificationMobileStatusLibrary';

export default function NotificationListViewOnLoad(clientAPI) {
    return libNotifStatus.isNotificationComplete(clientAPI).then(status => {
        if (status) {
            clientAPI.setActionBarItemVisible(0, false);
        }
    });
}
