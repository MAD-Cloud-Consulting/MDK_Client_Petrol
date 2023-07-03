import libForm from '../../Common/Library/FormatLibrary';

export default function NotificationActivityHeader(context) {
    let binding = context.binding;
    return libForm.formatDetailHeaderDisplayValue(context, binding.ActivitySortNumber, 
        context.localizeText('notification_activity'));
}
