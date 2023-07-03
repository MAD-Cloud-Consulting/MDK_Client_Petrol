import setCaption from '../WorkOrderListViewCaption';
import FollowOnWorkOrderListViewCaption from '../FollowOnWorkOrderListViewCaption';
import Logger from '../../Log/Logger';
import libCom from '../../Common/Library/CommonLibrary';

export default function FollowOnWorkOrderListViewOnPageLoad(pageClientAPI) {
    setCaption(FollowOnWorkOrderListViewCaption(pageClientAPI));
    Logger.info(pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryPrefs.global').getValue(), 'WorkOrderListViewOnPageLoad called');
    libCom.removeStateVariable(pageClientAPI, 'SupervisorAssignmentFilter');
}
