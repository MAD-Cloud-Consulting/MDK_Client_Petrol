import count from '../Notifications/NotificationsTotalCount';


export default function SideDrawerNotificationCount(context) {
    return count(context).then(result => {
        return context.localizeText('notifications_x', [result]);
    });
}
