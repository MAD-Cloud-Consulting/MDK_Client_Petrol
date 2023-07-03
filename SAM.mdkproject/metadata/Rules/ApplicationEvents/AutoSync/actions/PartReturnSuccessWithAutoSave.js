import ExecuteActionWithAutoSync from '../ExecuteActionWithAutoSync';

export default function PartReturnSuccessWithAutoSave(context) {
  return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/Parts/PartReturnSuccess.action');
}
