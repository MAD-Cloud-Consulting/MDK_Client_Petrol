import libForm from '../../Common/Library/FormatLibrary';

export default function WorkOrderHeaderFunctionalLocationDescription(context) {
    let binding = context.binding;
    if (binding.FunctionalLocation) {
        return libForm.getFormattedKeyDescriptionPair(context, binding.FunctionalLocation.FuncLocId, binding.FunctionalLocation.FuncLocDesc);
    } else {
        return '';
    }
}
