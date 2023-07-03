import WorkOrderSubOperationsCount from './WorkOrderSubOperationsCount';

export default async function SubEquipmentShouldRenderFooter(context) {
    const subOperationsCount = await WorkOrderSubOperationsCount(context);

    return subOperationsCount >= 2;
}
