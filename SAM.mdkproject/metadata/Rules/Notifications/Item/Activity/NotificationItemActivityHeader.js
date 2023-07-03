import libForm from '../../../Common/Library/FormatLibrary';

export default function NotificationItemActivityHeader(context) {
    let binding = context.binding;
    return libForm.formatDetailHeaderDisplayValue(context, binding.ActivitySortNumber, 
        context.localizeText('notification_item_activity'));
}
