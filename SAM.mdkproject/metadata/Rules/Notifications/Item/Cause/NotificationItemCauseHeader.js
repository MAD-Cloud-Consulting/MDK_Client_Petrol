import libForm from '../../../Common/Library/FormatLibrary';

export default function NotificationItemCauseHeader(context) {
    let binding = context.binding;
    return libForm.formatDetailHeaderDisplayValue(context, binding.CauseSortNumber, 
        context.localizeText('notification_item_cause'));
}
