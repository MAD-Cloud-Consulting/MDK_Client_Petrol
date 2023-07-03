import WorkOrderEquipmentCount from './WorkOrderEquipmentCount';

export default async function WorkOrderOperationsShouldRenderFooter(sectionProxy) {
    const equipmentCount = await WorkOrderEquipmentCount(sectionProxy);

    return equipmentCount >= 2;
}
