import ExecuteActionWithAutoSync from '../ExecuteActionWithAutoSync';

export default function PhysicalInventoryCreatedSuccessMessageWithAutoSync(context) {
    return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/Inventory/PhysicalInventory/PhysicalInventoryCreatedSuccessMessage.action');
}
