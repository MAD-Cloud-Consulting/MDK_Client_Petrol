import libCommon from '../Library/CommonLibrary';
import libNotif from '../../Notifications/NotificationLibrary';
import AssignmentType from '../Library/AssignmentType';
import Logger from '../../Log/Logger';
export default function ResetFlagsAndClosePage(pageProxy) {
    libCommon.setOnCreateUpdateFlag(pageProxy, '');
    libCommon.setOnChangesetFlag(pageProxy, false);
    libCommon.setOnWOChangesetFlag(pageProxy, false);
    libNotif.setAddFromJobFlag(pageProxy, false);
    libNotif.setAddFromMapFlag(pageProxy, false);
    libNotif.setAddFromOperationFlag(pageProxy, false);
    libNotif.setAddFromSuboperationFlag(pageProxy, false);
    libCommon.setStateVariable(pageProxy, 'FromOperationsList', false);
    try {
        AssignmentType.removeWorkOrderDefaultOverride();
    } catch (error) {
        Logger.error('AssigmentType RemoveWorkOrderDeafultOverrride:', error);
    }
    libCommon.clearDocDataOnClientData(pageProxy);
    return pageProxy.executeAction('/SAPAssetManager/Actions/Page/CancelPage.action');


}
