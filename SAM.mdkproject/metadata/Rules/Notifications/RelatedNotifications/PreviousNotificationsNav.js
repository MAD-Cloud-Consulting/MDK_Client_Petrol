export default function PreviousNotificationsNav(context) {
    context.getPageProxy().getClientData().ReferenceType = 'H';
    return context.executeAction('/SAPAssetManager/Actions/Notifications/RelatedNotifications/RelatedNotificationsNav.action');
}
