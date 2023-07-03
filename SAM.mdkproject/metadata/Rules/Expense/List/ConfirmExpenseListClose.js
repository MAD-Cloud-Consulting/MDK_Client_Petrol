import libCommon from '../../Common/Library/CommonLibrary';

export default function ConfirmExpenseListClose(context) {
    let expenses = libCommon.getStateVariable(context, 'expenses');
    let existingExpenses = expenses.filter((expense)=>{
        return !expense.removed;
    });
    libCommon.removeStateVariable(context, 'ExpenseListLoaded');
    if (existingExpenses.length) {
        return context.executeAction('/SAPAssetManager/Actions/Expense/ConfirmCloseExpensesPage.action');
    } else {
        libCommon.setStateVariable(context, 'expenses', []);
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
    }
}
