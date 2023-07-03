import notification from '../../../NotificationLibrary';

export default function NotificationItemCauseCodeQuery(context) {
    return notification.NotificationTaskActivityCodeQuery(context, 'CatTypeCauses', 'CauseCodeGroup');
}
