import CommonLibrary from '../../Common/Library/CommonLibrary';
import RelatedNotifReadlink from './NotificationHistoryReadLink';
export default function RelatedNotificationsCaption(context) {
    let notificationReadLink = RelatedNotifReadlink(context);
    return CommonLibrary.getEntitySetCount(context, notificationReadLink, '').then(count => {
         if (count) {
             let params=[count];
             return context.localizeText('related_notifications_with_count',params);
         } else {
             return context.localizeText('no_related_notifications');
         }
     });
 }
