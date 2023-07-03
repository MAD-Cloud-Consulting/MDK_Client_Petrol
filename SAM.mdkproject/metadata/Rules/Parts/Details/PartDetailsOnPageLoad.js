
import libCommon from '../../Common/Library/CommonLibrary';
import WorkOrderCompleted from '../../WorkOrders/Details/WorkOrderDetailsOnPageLoad';

export default function PartDetailsOnPageLoad(pageClientAPI) {
    let currentReadLink = libCommon.getTargetPathValue(pageClientAPI, '#Property:@odata.readLink');
    return WorkOrderCompleted(pageClientAPI).then((isCompleted) => {
        if (!isCompleted) {
            if (libCommon.isCurrentReadLinkLocal(currentReadLink)) {
                // Hide Add button since we cannot add note on local parts
                pageClientAPI.setActionBarItemVisible(0, false);
            } else {
                // Hide Edit button since we can only edit local parts
                pageClientAPI.setActionBarItemVisible(1, false);
            }
        }
    });
}
