import libForm from '../../Common/Library/FormatLibrary';

export default function WorkOrderHeaderEquipmentDescription(context) {
    let binding = context.binding;
    if (binding.Equipment) {
        return libForm.getFormattedKeyDescriptionPair(context, binding.Equipment.EquipId, binding.Equipment.EquipDesc);
    } else {
        return '';
    }
}
