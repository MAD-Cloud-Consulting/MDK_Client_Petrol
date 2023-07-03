import WorkOrderCompleted from '../../Details/WorkOrderDetailsOnPageLoad';
import libCom from '../../../Common/Library/CommonLibrary';

export default function WorkOrderOperationDetailsOnPageLoad(pageClientAPI) {

    libCom.removeStateVariable(pageClientAPI,'IgnoreToolbarUpdate');
    // handle the action bar items visiblity based on Work Order status
    return WorkOrderCompleted(pageClientAPI);
}
