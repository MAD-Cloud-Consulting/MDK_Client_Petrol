import common from '../../../../Common/Library/CommonLibrary';

export default function ActivityDetailsOnPageLoaded(context) {
    context.setActionBarItemVisible(0, false);
    let isVisiblePromise = null;

    switch (common.getWorkOrderAssnTypeLevel(context)) {
        case 'Header':
            // Header level: Check the OrderMobileStatus, and return the resolved Promise.
            isVisiblePromise = context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/WOHeader_Nav/OrderMobileStatus_Nav', [], '').then(result => {
                if (result && result.getItem(0)) {
                    let curMobileStatus = result.getItem(0).MobileStatus;
                    if (curMobileStatus === 'STARTED') {
                        return true;
                    } else {
                        return false;
                    }
                }
                return false;
            });
            break;
        case 'Operation':
            // Operation Level: Get a count of all of the Operations whose OperationMobileStatus is 'STARTED'. If count > 0, return true.
            isVisiblePromise = context.count('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/WOHeader_Nav/Operations', "$filter=OperationMobileStatus_Nav/MobileStatus eq 'STARTED'").then(function(count) {
                return (count > 0);
            });
            break;
        case 'SubOperation':
                // Suboperation Level: Get a count of all of the Operations who have a Sub-Operation whose SuboperationMobileStatus is 'STARTED'. If count > 0, return true.
            isVisiblePromise = context.count('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/WOHeader_Nav/Operations', "$filter=SubOperations/any(subop : subop/SubOpMobileStatus_Nav/MobileStatus eq 'STARTED')").then(function(count) {
                return (count > 0);
            });
            break;
        default:
            isVisiblePromise = Promise.resolve(false);
    }
    return isVisiblePromise.then(function(isVisible) {
        context.setActionBarItemVisible(0, isVisible);
    });
}
