import libCommon from '../../../Common/Library/CommonLibrary';
import ExpenseCreateNav from '../../../Expense/CreateUpdate/ExpenseCreateNav';
import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function ChangeExpenses(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    libCommon.setStateVariable(context, 'WOBinding', binding);
    context.getPageProxy().setActionBinding(binding);

    var expensesData = WorkOrderCompletionLibrary.getStep(context, 'expenses');
    if (!expensesData || !expensesData.count) {
        return ExpenseCreateNav(context);
    } else {
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
            return context.executeAction('/SAPAssetManager/Actions/Expense/ExpenseListNav.action');
        });
    }
}
