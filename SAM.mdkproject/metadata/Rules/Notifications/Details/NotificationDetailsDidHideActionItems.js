import HideActionItems from '../../Common/HideActionItems';
import libMobile from '../MobileStatus/NotificationMobileStatusLibrary';

export default function NotificationDetailsDidHideActionItems(context) {

    return libMobile.isNotificationComplete(context).then(isComplete => {
        if (isComplete) {
            HideActionItems(context, 2);
        }
        return isComplete;
    });
}
