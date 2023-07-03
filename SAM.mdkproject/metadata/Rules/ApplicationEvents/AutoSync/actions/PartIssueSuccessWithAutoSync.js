import ExecuteActionWithAutoSync from '../ExecuteActionWithAutoSync';

export default function PartIssueSuccessWithAutoSync(context) {
  return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/Parts/PartIssueSuccess.action');
}
