import { EquipmentLibrary as EquipmentLib } from './EquipmentLibrary';

/**
 * On Page Load rule for equipment detail screen.
 * @param {*} context 
 */
export default function EquipmentDetailsOnPageLoad(context) {
    return EquipmentLib.equipmentDetailsOnPageLoad(context);
}
