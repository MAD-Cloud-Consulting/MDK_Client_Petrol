import IsEditMode from './IsEditMode';
import ToggleEditMode from './ToggleEditMode';
import common from '../../Common/Library/CommonLibrary';
import mileageAddNav from '../../ServiceOrders/Mileage/MileageAddNav';
import AutoSyncOnSave from '../../ApplicationEvents/AutoSync/AutoSyncOnSave';

export default function OnDonePress(context) {
    if (IsEditMode(context)) {
        ToggleEditMode(context);
    } else {
        let previousPage = context.evaluateTargetPathForAPI('#Page:-Previous');
        common.setStateVariable(context, 'IsFinalConfirmation', false, common.getPageName(previousPage)); // this is needed to later create final confirmation after we created expense
        let expenses = common.getStateVariable(context, 'expenses');
        let successAction = '/SAPAssetManager/Actions/Page/ClosePage.action';

        if (expenses && expenses.length > 0 && expenses.filter(expense => !expense.removed).length > 0) {
            successAction = '/SAPAssetManager/Actions/Expense/ExpensesCreatedSuccessfully.action';
        }
        common.removeStateVariable(context, 'ExpenseListLoaded');
        return context.executeAction(successAction).then(() => {
            if (common.getStateVariable(context, 'IsExecuteMilage')) {
                return mileageAddNav(context).then(() => {
                    common.setStateVariable(context, 'IsExecuteMilage', false);
                    return Promise.resolve();
                });
            }
            return AutoSyncOnSave(context);
        });
    }
}
