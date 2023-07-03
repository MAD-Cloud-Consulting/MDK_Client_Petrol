import ExecuteActionWithAutoSync from '../ExecuteActionWithAutoSync';

export default function CreateEntitySuccessMessageNoClosePageWithAutoSync(context) {
    return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessageNoClosePage.action');
}
