/**
* Get the Technical Object Id and Description
* @param {IClientAPI} context
*/
export default function TechnicalObjectIdAndDescription(context) {

    let binding = context.binding;
    
    if (binding) {
        if (binding.EquipNum) { //Technical Object is an Equipment
            if (binding.Equip_Nav) {
                return `${binding.Equip_Nav.EquipDesc} (${binding.Equip_Nav.EquipId})`;
            }
        } else if (binding.FuncLocId) {
            if (binding.FuncLoc_Nav) {
                return `${binding.FuncLoc_Nav.FuncLocDesc} (${binding.FuncLoc_Nav.FuncLocId})`;
            }
        }
    }

    return '-';

}
