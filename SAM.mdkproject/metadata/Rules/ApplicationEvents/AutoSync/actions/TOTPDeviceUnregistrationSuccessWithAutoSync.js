import ExecuteActionWithAutoSync from '../ExecuteActionWithAutoSync';

export default function TOTPDeviceUnregistrationSuccessWithAutoSync(context) {
  return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/DigitalSignature/TOTPDeviceUnregistrationSuccess.action');
}
