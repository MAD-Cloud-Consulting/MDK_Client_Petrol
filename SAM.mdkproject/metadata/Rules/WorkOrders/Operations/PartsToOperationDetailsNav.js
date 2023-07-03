import libCom from '../../Common/Library/CommonLibrary';

export default function PartsToOperationDetailsNav(context) {
    let previousPage = context.evaluateTargetPathForAPI('#Page:-Previous');
    if (libCom.getPageName(previousPage) === 'PartsListViewPage') {
        let partsListViewPreviousPage = previousPage.evaluateTargetPathForAPI('#page:-Previous');
        if (libCom.getPageName(partsListViewPreviousPage) === 'WorkOrderOperationDetailsPage') {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
            });
        }
    }
    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationDetailsNav.action');
}
