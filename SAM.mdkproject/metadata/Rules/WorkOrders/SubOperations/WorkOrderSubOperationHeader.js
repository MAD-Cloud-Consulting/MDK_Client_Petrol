import libForm from '../../Common/Library/FormatLibrary';

export default function WorkOrderSubOperationHeader(context) {
    let binding = context.binding;
    return libForm.formatDetailHeaderDisplayValue(context, binding.SubOperationNo, context.localizeText('suboperation'));
}
