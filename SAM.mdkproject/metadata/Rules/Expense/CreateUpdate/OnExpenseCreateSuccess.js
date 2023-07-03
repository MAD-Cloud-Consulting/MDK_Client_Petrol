import libCommon from '../../Common/Library/CommonLibrary';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';

export default function OnExpenseCreateSuccess(context) {
    if (!libCommon.getStateVariable(context, 'expenseDiscardEnabled')) {
        
        if (IsCompleteAction(context)) { 
            let binding = libCommon.getBindingObject(context);
            context.setActionBinding(binding);
        }

        libCommon.setStateVariable(context, 'ExpenseEditMode', false);

        if (libCommon.getStateVariable(context, 'ExpenseListLoaded')) {
            return context.executeAction('/SAPAssetManager/Actions/Common/CloseChildModal.action');
        } else {
            return context.executeAction('/SAPAssetManager/Actions/Expense/ExpenseListNav.action');
        }
    }
    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
}
