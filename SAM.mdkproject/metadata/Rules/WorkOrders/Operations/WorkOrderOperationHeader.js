import libForm from '../../Common/Library/FormatLibrary';

export default function WorkOrderOperationHeader(context) {
    let binding = context.binding;
    return libForm.formatDetailHeaderDisplayValue(context, binding.OperationNo, 
        context.localizeText('operation'));
}
