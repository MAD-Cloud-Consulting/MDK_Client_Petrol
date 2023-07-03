
export default function WorkOrderNotificationNumber(context) {
    if (context.binding.FromNotification) {
        return context.binding.NotificationNumber;
    }

    return '';
}
