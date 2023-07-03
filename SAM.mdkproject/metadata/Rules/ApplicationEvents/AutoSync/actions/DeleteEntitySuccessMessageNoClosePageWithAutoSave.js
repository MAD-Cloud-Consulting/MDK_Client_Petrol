import ExecuteActionWithAutoSync from '../ExecuteActionWithAutoSync';

export default function DeleteEntitySuccessMessageNoClosePageWithAutoSave(context) {
    return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntitySuccessMessageNoClosePage.action');
}
