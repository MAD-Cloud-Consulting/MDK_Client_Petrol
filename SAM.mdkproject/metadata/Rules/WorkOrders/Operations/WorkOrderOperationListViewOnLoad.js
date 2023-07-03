import libWOStatus from '../MobileStatus/WorkOrderMobileStatusLibrary';
import setCaption from './WorkOrderOperationListViewSetCaption';
import libCommon from '../../Common/Library/CommonLibrary';

export default function WorkOrderOperationListViewOnLoad(clientAPI) {
    setCaption(clientAPI);

    var parameters = libCommon.getStateVariable(clientAPI,'OPERATIONS_FILTER');
    if (!parameters) {
        libCommon.setStateVariable(clientAPI, 'OPERATIONS_FILTER', '');
    }
    return libWOStatus.isOrderComplete(clientAPI).then(status => {
        if (status) {
            clientAPI.setActionBarItemVisible(0, false);
        }
    });
}
