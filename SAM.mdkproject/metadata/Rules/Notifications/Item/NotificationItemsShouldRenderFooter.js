import NotificationItemsCount from './NotificationItemsCount';

export default async function NotificationItemsShouldRenderFooter(controlProxy) {
    const notificationItemsCount = await NotificationItemsCount(controlProxy);

    return notificationItemsCount >= 2;
}
