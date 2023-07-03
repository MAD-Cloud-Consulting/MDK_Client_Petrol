import SubEquipmentCount from './SubEquipmentCount';

export default async function SubEquipmentShouldRenderFooter(context) {
    const equipmentCount = await SubEquipmentCount(context);

    return equipmentCount > 2;
}
