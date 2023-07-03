import ExecuteActionWithAutoSync from '../ExecuteActionWithAutoSync';

export default function CreateEntitySuccessMessageWithAutoSave(context) {
  return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessage.action');
}
