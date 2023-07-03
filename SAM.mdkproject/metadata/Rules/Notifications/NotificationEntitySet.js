export default function NotificationEntitySet(context) {
    let binding = context.getPageProxy().binding;
    if (binding && binding['@odata.readLink']) {
        return binding['@odata.readLink'] + '/NotificationHeader';
    } else {
        return 'MyNotificationHeaders';
    }
}
