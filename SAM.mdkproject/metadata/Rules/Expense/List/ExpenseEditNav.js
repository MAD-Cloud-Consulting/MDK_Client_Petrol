import libCommon from '../../Common/Library/CommonLibrary';

export default function ExpenseEditNav(context) {
    libCommon.setOnCreateUpdateFlag(context, 'UPDATE');
    return context.executeAction('/SAPAssetManager/Actions/Expense/ExpenseCreateUpdateNav.action');
}
