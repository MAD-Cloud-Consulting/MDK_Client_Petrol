import queryOptions from '../SubOperations/SubOperationsListViewQueryOption';
import libCom from '../Common/Library/CommonLibrary';

export default function SubOperationDetailsNav(context) {

    let actionBinding = context.getPageProxy().getActionBinding();
    let previousPageProxy = context.getPageProxy().evaluateTargetPathForAPI('#Page:-Previous');

    if (libCom.getPageName(previousPageProxy) === 'SubOperationDetailsPage' && previousPageProxy.getBindingObject().SubOperationNo === actionBinding.SubOperationNo) { //if the previous page was the parent workorder then, navigate back
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
    }
    
    return context.read('/SAPAssetManager/Services/AssetManager.service', actionBinding['@odata.readLink'], [], queryOptions(context)).then(function(result) {
        context.getPageProxy().setActionBinding(result.getItem(0));
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationDetailsNav.action');
    });
}
