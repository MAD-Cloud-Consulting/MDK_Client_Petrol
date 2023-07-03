
import NotificationDetailsNavQueryOptions from '../Details/NotificationDetailsNavQueryOptions';

export default function NotificationDetailsFromMapQueryOptions(context) {
    return NotificationDetailsNavQueryOptions(context) + '&$filter=NotificationNumber eq \'' + context.binding.NotificationNumber + '\'';
}
