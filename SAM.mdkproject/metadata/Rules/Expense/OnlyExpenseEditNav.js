import libCommon from '../Common/Library/CommonLibrary';

export default function OnlyExpenseEditNav(context) {
    libCommon.setStateVariable(context, 'expenseDiscardEnabled', true);
    libCommon.setStateVariable(context, 'ExpenseScreenReopened', true);
    
    context.getClientData().currentObject = context.getPageProxy().getActionBinding();
    libCommon.setOnCreateUpdateFlag(context, 'UPDATE');
    return context.executeAction('/SAPAssetManager/Actions/Expense/ExpenseCreateUpdateNav.action');
}
