import NotificationsTasksCount from './NotificationsTasksCount';

export default async function NotificationsTasksShouldRenderFooter(controlProxy) {
    const notificationsTasksCount = await NotificationsTasksCount(controlProxy);

    return notificationsTasksCount > 2;
}

