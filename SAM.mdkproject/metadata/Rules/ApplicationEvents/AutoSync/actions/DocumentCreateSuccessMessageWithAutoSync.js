import ExecuteActionWithAutoSync from '../ExecuteActionWithAutoSync';

export default function DocumentCreateSuccessMessageWithAutoSync(context) {
  return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/Inventory/IssueOrReceipt/DocumentCreateSuccessMessage.action');
}
