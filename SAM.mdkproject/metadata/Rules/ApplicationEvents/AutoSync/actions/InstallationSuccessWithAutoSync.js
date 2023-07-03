import ExecuteActionWithAutoSync from '../ExecuteActionWithAutoSync';

export default function InstallationSuccessWithAutoSync(context) {
  return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/Equipment/Installation/InstallationSuccess.action');
}
