export default function EquipmentTechnicalObjectId(context) {
    if (context.binding.TechnicalID) {
        return context.localizeText('tech_id') + ': ' + context.binding.TechnicalID;
    }
}
