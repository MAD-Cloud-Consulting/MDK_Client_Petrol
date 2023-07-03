import libForm from '../../Common/Library/FormatLibrary';

export default function PRTEquipmentDetailsCaption(context) {
    return libForm.formatDetailHeaderDisplayValue(context, context.binding.PRTEquipment.EquipId, 
        context.localizeText('equipment'));
}
