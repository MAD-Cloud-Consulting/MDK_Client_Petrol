import libCom from '../Common/Library/CommonLibrary';

export default function PartsListViewNav(context) {

    let previousPageProxy = context.getPageProxy().evaluateTargetPathForAPI('#Page:-Previous');

    if (libCom.getPageName(previousPageProxy) === 'PartDetailsPage') {
        let partsPreviousPage = previousPageProxy.evaluateTargetPathForAPI('#Page:-Previous');
        if (libCom.getPageName(partsPreviousPage) === 'PartsListViewPage') {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
            });
        }
    }
    
    return context.executeAction('/SAPAssetManager/Actions/Parts/PartsListViewNav.action');
}
