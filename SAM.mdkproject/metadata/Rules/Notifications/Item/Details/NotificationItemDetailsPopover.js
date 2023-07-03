import libNotifStatus from '../../MobileStatus/NotificationMobileStatusLibrary';
import libCommon from '../../../Common/Library/CommonLibrary';

export default function NotificationItemDetailsPopover(context) {
    let currentReadLink = libCommon.getTargetPathValue(context, '#Property:@odata.readLink');
    let isLocal = libCommon.isCurrentReadLinkLocal(currentReadLink);
    if (!isLocal) {
        return libNotifStatus.isNotificationComplete(context).then(status => {
            if (!status) {
                return context.executeAction('/SAPAssetManager/Actions/Notifications/Item/NotificationItemDetailsPopover.action');
            }
            return '';
        });
    }
    return context.executeAction('/SAPAssetManager/Actions/Notifications/Item/NotificationItemDetailsPopover.action');
}
