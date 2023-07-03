import libOprMobile from './OperationMobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import PDFGenerateDuringCompletion from '../../PDF/PDFGenerateDuringCompletion';
import ExpensesVisible from '../../ServiceOrders/Expenses/ExpensesVisible';
import MileageIsEnabled from '../../ServiceOrders/Mileage/MileageIsEnabled';
import mileageAddNav from '../../ServiceOrders/Mileage/MileageAddNav';
import expenseCreateNav from '../../Expense/CreateUpdate/ExpenseCreateNav';

export default function OperationCompleteStatus(context) {
    //Save the name of the page where user swipped the context menu from. It's used in other code to check if a context menu swipe was done.
    libCommon.setStateVariable(context, 'contextMenuSwipePage', libCommon.getPageName(context));
    
    //Save the operation binding object. Coming from a context menu swipe does not allow us to get binding object using context.binding.
    libCommon.setBindingObject(context);
    
    //Set ChangeStatus property to 'Completed'.
    //ChangeStatus is used by OperationMobileStatusFailureMessage.action & OperationMobileStatusSuccessMessage.action
    context.getPageProxy().getClientData().ChangeStatus = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    
    context.showActivityIndicator('');
    return libOprMobile.completeOperation(context).then(() => {
        let executeExpense = false;
        let executeMilage = false;
        if (ExpensesVisible(context)) {
            libCommon.setStateVariable(context, 'IsWOCompletion', true);
            executeExpense = true;
        } 
        if (MileageIsEnabled(context)) {
            libCommon.setStateVariable(context, 'IsOperationCompletion', true);
            executeMilage = true;
        }
        libCommon.setStateVariable(context, 'IsExecuteExpense', executeExpense);
        libCommon.setStateVariable(context, 'IsExecuteMilage', executeMilage);

        // IsPDFGenerate variable handles the generation after the mileage or expense creation
        libCommon.setStateVariable(context, 'IsPDFGenerate', executeExpense || executeMilage);
        let binding = libCommon.getBindingObject(context);
        if (executeExpense) {
            context.getPageProxy().setActionBinding(binding);
            return expenseCreateNav(context);
        } else if (executeMilage) {
            context.getPageProxy().setActionBinding(binding);
            return mileageAddNav(context);
        } else {
            return PDFGenerateDuringCompletion(context);
        }
    }).finally(() => {
        libCommon.removeBindingObject(context);
        libCommon.removeStateVariable(context, 'contextMenuSwipePage');
        delete context.getPageProxy().getClientData().ChangeStatus;
        context.getPageProxy().getClientData().didShowSignControl = false;
    });
}
