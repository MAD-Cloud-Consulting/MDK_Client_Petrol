import NotificationsActivitiesCount from './NotificationsActivitiesCount';

export default async function NotificationsActivitiesShouldRenderFooter(clientAPI) {
    const notificationActivitiesCount = await NotificationsActivitiesCount(clientAPI);

    return notificationActivitiesCount > 2;
}
