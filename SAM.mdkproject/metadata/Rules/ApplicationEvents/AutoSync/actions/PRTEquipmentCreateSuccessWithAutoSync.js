import ExecuteActionWithAutoSync from '../ExecuteActionWithAutoSync';

export default function PRTEquipmentCreateSuccessWithAutoSync(context) {
  return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/WorkOrders/Operations/PRT/CreateUpdate/PRTEquipmentCreateSuccess.action');
}
