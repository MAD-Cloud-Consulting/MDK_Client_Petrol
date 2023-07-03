import ExecuteActionWithAutoSync from '../ExecuteActionWithAutoSync';

export default function UpdateEntitySuccessMessageNoCloseWithAutoSync(context) {
    return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessageNoClose.action');
}
