import libWOStatus from '../MobileStatus/WorkOrderMobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';

export default function WorkOrderSubOperationDetailsPopover(context) {
    let currentReadLink = libCommon.getTargetPathValue(context, '#Property:@odata.readLink');
    let isLocal = libCommon.isCurrentReadLinkLocal(currentReadLink);
    if (!isLocal) {
        return libWOStatus.isOrderComplete(context).then(status => {
            if (!status) {
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/WorkOrderSubOperationDetailsPopover.action');
            } else {
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderUpdateNotChangeable.action');
            }
        });
    }
    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/WorkOrderSubOperationDetailsPopover.action');
}
