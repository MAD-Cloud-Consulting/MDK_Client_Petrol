export default function InspectionPointTechnicalObjectDesc(context) {
    let binding = context.binding;
    if (binding.hasOwnProperty('Equip_Nav') && binding.Equip_Nav != null) {
        return binding.Equip_Nav.EquipDesc + ' - ' + binding.EquipNum;
    } else if (binding.hasOwnProperty('FuncLoc_Nav') && binding.FuncLoc_Nav != null) {
        return binding.FuncLoc_Nav.FuncLocDesc + ' - ' + binding.FuncLoc_Nav.FuncLocId;
    }
    return '';
}
