import libCommon from '../../Common/Library/CommonLibrary';

export default function ExpenseCreateNav(context) {
    libCommon.setOnCreateUpdateFlag(context, 'CREATE');
    libCommon.setStateVariable(context, 'ExpenseScreenReopened', true);
    libCommon.setStateVariable(context, 'expenses', []);
    libCommon.setStateVariable(context, 'expenseDiscardEnabled', false);
    return context.executeAction('/SAPAssetManager/Actions/Expense/ExpenseCreateUpdateNav.action');
}
