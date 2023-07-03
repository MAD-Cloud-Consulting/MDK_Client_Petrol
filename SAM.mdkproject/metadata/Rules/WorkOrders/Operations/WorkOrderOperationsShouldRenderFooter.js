import WorkOrderOperationsCount from './WorkOrderOperationsCount';

export default async function WorkOrderOperationsShouldRenderFooter(sectionProxy) {
    const operationsCount = await WorkOrderOperationsCount(sectionProxy);

    return operationsCount > 2;
}
