import { EquipmentLibrary as equipmentLib } from '../../Rules/Equipment/EquipmentLibrary';

export default function OperationHeaderEquipmentDescription(context) {
    let binding = context.binding;
    if (binding.OperationEquipment) {
        return equipmentLib.getEquipmentDescriptionWithIdFormat(context, binding.OperationEquipment);
    } else {
        return '';
    }
}


