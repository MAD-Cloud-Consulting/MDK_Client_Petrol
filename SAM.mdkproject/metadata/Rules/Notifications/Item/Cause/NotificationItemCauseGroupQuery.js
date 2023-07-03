import notification from '../../NotificationLibrary';

export default function NotificationItemCauseGroupQuery(context) {
    return notification.NotificationItemTaskActivityGroupQuery(context, 'CatTypeCauses');
}
