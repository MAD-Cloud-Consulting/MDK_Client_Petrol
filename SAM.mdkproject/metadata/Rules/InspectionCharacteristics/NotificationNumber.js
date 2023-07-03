/**
* Returns the Notification Number
* @param {IClientAPI} context
*/
export default function NotificationNumber(context) {
    if (context.binding && context.binding.NotifItems_Nav.length > 0) {
        return context.binding.NotifItems_Nav[0].NotificationNumber;
    } else {
        return '-';
    }
}
