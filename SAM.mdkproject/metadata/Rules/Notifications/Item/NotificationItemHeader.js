import libForm from '../../Common/Library/FormatLibrary';

export default function NotificationItemHeader(context) {
    let binding = context.binding;
    return libForm.formatDetailHeaderDisplayValue(context, binding.ItemNumber, 
        context.localizeText('notification_item'));
}
