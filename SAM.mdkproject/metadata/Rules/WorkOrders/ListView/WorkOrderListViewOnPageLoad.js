import Logger from '../../Log/Logger';
import setCaption from '../WorkOrderListViewCaption';
import libCom from '../../Common/Library/CommonLibrary';

export default function WorkOrderListViewOnPageLoad(pageClientAPI) {
    setCaption(pageClientAPI);
    Logger.info(pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPrefs.global').getValue(), 'WorkOrderListViewOnPageLoad called');
    libCom.removeStateVariable(pageClientAPI, 'SupervisorAssignmentFilter');
}
