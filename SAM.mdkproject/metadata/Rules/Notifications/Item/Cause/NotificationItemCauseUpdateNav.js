import libCommon from '../../../Common/Library/CommonLibrary';
import libNotifStatus from '../../MobileStatus/NotificationMobileStatusLibrary';

export default function NotificationItemCauseUpdateNav(context) {
    let currentReadLink = libCommon.getTargetPathValue(context, '#Property:@odata.readLink');
    let isLocal = libCommon.isCurrentReadLinkLocal(currentReadLink);
    libCommon.setOnCreateUpdateFlag(context, 'UPDATE');
    if (!isLocal) {
        return libNotifStatus.isNotificationComplete(context).then(status => {
            if (!status) {
                return context.executeAction('/SAPAssetManager/Actions/Notifications/Item/NotificationItemCauseCreateUpdateNav.action');
            }
            return '';
        });
    }
    return context.executeAction('/SAPAssetManager/Actions/Notifications/Item/NotificationItemCauseCreateUpdateNav.action');
}
