import { EquipmentLibrary as EquipmentLib } from './EquipmentLibrary';

/**
 * Rule used to display the various properties on the equipment detail page sections.
 * @see EquipmentLibrary
 */
export default function EquipmentDetailViewFormat(context) {
    return EquipmentLib.equipmentDetailViewFormat(context);
}
