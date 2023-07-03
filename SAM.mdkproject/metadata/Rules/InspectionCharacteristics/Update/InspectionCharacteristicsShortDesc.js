import libVal from '../../Common/Library/ValidationLibrary';

export default function InspectionCharacteristicsShortDesc(context) {
    let titleString = '';
    let binding = context.binding;

    if (binding.InspectionChar) {
        titleString += binding.InspectionChar;
    }

    if (binding.InspectionPoint_Nav.hasOwnProperty('Equip_Nav') && !libVal.evalIsEmpty(binding.InspectionPoint_Nav.Equip_Nav)) {
        titleString += ' (' + binding.InspectionPoint_Nav.Equip_Nav.EquipDesc + ' - ' + binding.InspectionPoint_Nav.EquipNum + ')';
    } else if (binding.InspectionPoint_Nav.hasOwnProperty('FuncLoc_Nav') && !libVal.evalIsEmpty(binding.InspectionPoint_Nav.FuncLoc_Nav)) {
        titleString += ' (' + binding.InspectionPoint_Nav.FuncLoc_Nav.FuncLocDesc + ' - ' + binding.InspectionPoint_Nav.FuncLoc_Nav.FuncLocId + ')';
    }

    if (binding.CharCategory && binding.CharCategory === 'X') {
        titleString += '*';
    }
    return titleString;
}
