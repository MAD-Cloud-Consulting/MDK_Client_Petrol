import CommonLibrary from '../../Common/Library/CommonLibrary';
import RelatedNotifReadlink from './NotificationHistoryReadLink';
export default function NotificationHistoriesCount(context) {
    let entity = context.getPageProxy();
    let notificationReadLink = RelatedNotifReadlink(entity);
    return CommonLibrary.getEntitySetCount(context,notificationReadLink, '');
}
