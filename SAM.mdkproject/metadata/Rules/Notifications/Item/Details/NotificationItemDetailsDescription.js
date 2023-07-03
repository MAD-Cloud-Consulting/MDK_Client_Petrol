import {ValueIfExists} from '../../../Common/Library/Formatter';

export default function NotificationItemDetailsDescription(context) {
    let binding = context.getBindingObject();
    return ValueIfExists(binding.ItemText);
}
