import ExecuteActionWithAutoSync from '../ExecuteActionWithAutoSync';

export default function DiscardEntitySuccessMessageWithAutoSync(context) {
    return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/Meters/CreateUpdate/DiscardEntitySuccessMessage.action');
}
