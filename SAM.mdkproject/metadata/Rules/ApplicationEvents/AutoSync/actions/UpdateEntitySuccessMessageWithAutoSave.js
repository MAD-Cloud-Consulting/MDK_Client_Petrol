import ExecuteActionWithAutoSync from '../ExecuteActionWithAutoSync';

export default function UpdateEntitySuccessMessageWithAutoSave(context) {
    return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action');
}
