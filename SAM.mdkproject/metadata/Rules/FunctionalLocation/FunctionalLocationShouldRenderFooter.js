import FunctionalLocationCount from './FunctionalLocationCount';

export default async function WorkOrderOperationsShouldRenderFooter(sectionProxy) {
    const functionalLocationCount = await FunctionalLocationCount(sectionProxy);

    return functionalLocationCount >= 2;
}
