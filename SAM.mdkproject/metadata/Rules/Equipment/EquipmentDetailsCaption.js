import libForm from '../Common/Library/FormatLibrary';

export default function EquipmentDetailsCaption(context) {
    let binding = context.binding;
    return libForm.formatDetailHeaderDisplayValue(context, binding.EquipId, 
        context.localizeText('equipment'));
}
