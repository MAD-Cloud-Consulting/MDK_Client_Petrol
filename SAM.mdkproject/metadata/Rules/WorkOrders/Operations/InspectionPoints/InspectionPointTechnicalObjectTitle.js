export default function InspectionPointTechnicalObjectTitle(context) {
    let binding = context.binding;
    if (binding.hasOwnProperty('Equip_Nav') && binding.Equip_Nav != null) {
        return context.localizeText('equipment');
    } else if (binding.hasOwnProperty('FuncLoc_Nav') && binding.FuncLoc_Nav != null) {
        return context.localizeText('functional_location');
    }
    return '';
}
