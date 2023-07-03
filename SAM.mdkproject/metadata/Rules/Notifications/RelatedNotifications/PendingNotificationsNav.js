export default function PendingNotificationsNav(context) {
    context.getPageProxy().getClientData().ReferenceType = 'P';
    return context.executeAction('/SAPAssetManager/Actions/Notifications/RelatedNotifications/RelatedNotificationsNav.action');
}
