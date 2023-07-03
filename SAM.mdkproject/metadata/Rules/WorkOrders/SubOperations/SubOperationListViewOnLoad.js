import libWOStatus from '../MobileStatus/WorkOrderMobileStatusLibrary';
import setCaption from '../SubOperations/CreateUpdate/WorkOrderSubOperationListViewCaption';

export default function SubOperationListViewOnLoad(clientAPI) {
    setCaption(clientAPI);
    return libWOStatus.isOrderComplete(clientAPI).then(status => {
        if (status) {
            clientAPI.setActionBarItemVisible(0, false);
        }
    });
}
