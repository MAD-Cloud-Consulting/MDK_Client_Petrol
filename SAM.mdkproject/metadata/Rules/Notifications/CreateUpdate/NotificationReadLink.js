
export default function NotificationReadLink(context) {
    if (context.currentPage.notifBinding) {
        let binding = context.currentPage.notifBinding;
        return binding['@odata.editLink'];
    }
    return '';
}
