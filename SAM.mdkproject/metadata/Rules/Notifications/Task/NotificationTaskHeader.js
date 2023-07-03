import libForm from '../../Common/Library/FormatLibrary';

export default function NotificationTaskHeader(context) {
    let binding = context.binding;
    return libForm.formatDetailHeaderDisplayValue(context, binding.TaskSortNumber, 
        context.localizeText('notification_task'));
}
