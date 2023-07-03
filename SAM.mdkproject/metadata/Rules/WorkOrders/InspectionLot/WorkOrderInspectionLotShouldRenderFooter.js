import WorkOrderInspectionLotCount from './WorkOrderInspectionLotCount';

export default async function DocumentsBDSShouldRenderFooter(controlProxy) {
    const lotsCount = await WorkOrderInspectionLotCount(controlProxy);

    return lotsCount > 2;
}
