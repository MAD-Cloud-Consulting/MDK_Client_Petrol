import IsEditMode from './IsEditMode';
import ExpenseEditNav from './ExpenseEditNav';
import libCommon from '../../Common/Library/CommonLibrary';

export default function OnExpensePress(context) {
    let binding = context.getPageProxy().getActionBinding();

    if (binding && IsEditMode(context)) {
        let expenses = libCommon.getStateVariable(context, 'expenses');
       
        return context.executeAction({'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action', 'Properties': { 
            'Title': context.localizeText('confirm_delete'),
            'Message': context.localizeText('are_you_sure'),
            'OKCaption': context.localizeText('delete'),
            'CancelCaption': context.localizeText('cancel'),
            } } 
            ).then(successResult => {
            let selection = JSON.parse(successResult.data);
            if (selection === true) {
                if (expenses.length > 0) {
                    let expenseIndex = expenses.findIndex((expense)=>{
                        return expense.localConfirmationNum === binding.ConfirmationNum && expense.localConfirmationCounter === binding.ConfirmationCounter;
                    });
        
                    if (expenseIndex !== -1) {
                        expenses[expenseIndex].removed = true;
                        libCommon.setStateVariable(context, 'expenses', expenses);
                    }
                }
                return context.executeAction({'Name': '/SAPAssetManager/Actions/Expense/ExpenseRemove.action', 'Properties': {
                    'Target': {
                        'EntitySet': 'Confirmations',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'ReadLink': `Confirmations(ConfirmationNum='${binding.ConfirmationNum}',ConfirmationCounter='${binding.ConfirmationCounter}')`,
                    },
                    'Headers': {
                        'OfflineOData.TransactionID': binding.ConfirmationNum,
                    },
                }});
            } 
            return null;
        });
        
    } else {
        return ExpenseEditNav(context);
    }
}
