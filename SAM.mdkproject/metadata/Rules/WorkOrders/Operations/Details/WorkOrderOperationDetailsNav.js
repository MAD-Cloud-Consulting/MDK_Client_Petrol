import libCom from '../../../Common/Library/CommonLibrary';

export default function WorkOrderOperationDetailsNav(sectionedTableProxy) {
    let previousPageProxy;
    let actionBinding;
    let beforePreviousPageProxy;

    try {
        actionBinding = sectionedTableProxy.getPageProxy().getActionBinding();
        previousPageProxy = sectionedTableProxy.getPageProxy().evaluateTargetPathForAPI('#Page:-Previous');
        beforePreviousPageProxy = previousPageProxy.evaluateTargetPathForAPI('#Page:-Previous');
    } catch (err) {
        return sectionedTableProxy.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationDetailsNav.action');
    }

    if (previousPageProxy) {
        if (libCom.getPageName(previousPageProxy) === 'ObjectListViewPage' && libCom.getPageName(beforePreviousPageProxy) === 'WorkOrderOperationDetailsPage') {
            return sectionedTableProxy.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                return sectionedTableProxy.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
            });
        }
    
        if (libCom.getPageName(previousPageProxy) === 'WorkOrderOperationDetailsPage' && previousPageProxy.getBindingObject().OperationNo === actionBinding.OperationNo) {
            return sectionedTableProxy.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
        }
    }

    return sectionedTableProxy.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationDetailsNav.action');
}
