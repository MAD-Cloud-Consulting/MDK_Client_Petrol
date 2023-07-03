import IsCompleteAction from '../../../WorkOrders/Complete/IsCompleteAction';
import ExecuteActionWithAutoSync from '../ExecuteActionWithAutoSync';

export default function DeleteEntitySuccessMessageWithAutoSave(context) {
    if (IsCompleteAction(context)) {
        return Promise.resolve();
    }
    return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntitySuccessMessage.action');
}
