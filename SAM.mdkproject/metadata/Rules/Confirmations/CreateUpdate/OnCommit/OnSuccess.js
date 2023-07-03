import libCom from '../../../Common/Library/CommonLibrary';
import IsCompleteAction from '../../../WorkOrders/Complete/IsCompleteAction';
import WorkOrderCompletionLibrary from '../../../WorkOrders/Complete/WorkOrderCompletionLibrary';
import ExecuteActionWithAutoSync from '../../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';

export default function OnSuccess(context, isOnCreate=true) {

    let prevClientData = context.evaluateTargetPath('#Page:-Previous/#ClientData');
    let action;

    if (prevClientData && prevClientData.workingReadLink !== undefined) { 
        action = '/SAPAssetManager/Actions/Page/ClosePage.action';
    } else if (isOnCreate) {
        libCom.setStateVariable(context, 'ObjectCreatedName', 'Confirmation');
        action = '/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessageNoClosePage.action';
    } else {
        action = '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action';
    }

    if (IsCompleteAction(context)) {
        return WorkOrderCompletionLibrary.getInstance().openMainPage(context);
    }

    return ExecuteActionWithAutoSync(context, action);
}
