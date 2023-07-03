import libDocument from './DocumentLibrary';
import libWOStatus from '../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import libNotifStatus from '../Notifications/MobileStatus/NotificationMobileStatusLibrary';
import setCaption from './DocumentListViewCaption';
export default function DocumentListViewOnLoad(context) {
    setCaption(context);
    switch (libDocument.getParentObjectType(context)) {
        case libDocument.ParentObjectType.WorkOrder:
            return libWOStatus.isOrderComplete(context).then(status => {
                if (status) {
                    context.setActionBarItemVisible(1, false);
                }
            });
        case libDocument.ParentObjectType.Notification:
            return libNotifStatus.isNotificationComplete(context).then(status => {
                if (status) {
                    context.setActionBarItemVisible(1, false);               
                }
            });
        default:
            break;
    }   
}
