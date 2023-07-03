import libForm from '../Common/Library/FormatLibrary';

export default function NotificationHeader(context) {
    let binding = context.binding;
    return libForm.formatDetailHeaderDisplayValue(context, binding.NotificationNumber, 
        context.localizeText('notification'));
}
