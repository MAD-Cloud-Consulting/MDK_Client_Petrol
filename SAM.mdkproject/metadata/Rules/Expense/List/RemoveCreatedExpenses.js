import commonLib from '../../Common/Library/CommonLibrary';

export default function RemoveCreatedExpenses(context) {
    let expenses = commonLib.getStateVariable(context, 'expenses');
    
    if (expenses && expenses.length) {
        let actions = [];

        expenses.forEach((expense) => {
            if (!expense.removed) {
                expense.removed = true;
                actions.push(context.executeAction({'Name': '/SAPAssetManager/Actions/Expense/ExpenseRemove.action', 'Properties': {
                    'Target': {
                        'EntitySet': 'Confirmations',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'ReadLink': `Confirmations(ConfirmationNum='${expense.localConfirmationNum}',ConfirmationCounter='${expense.localConfirmationCounter}')`,
                    },
                    'Headers': {
                        'OfflineOData.TransactionID': expense.localConfirmationNum,
                    },
                }}));
            }
        });
        
        commonLib.setStateVariable(context, 'expenses', expenses);
        return Promise.all(actions);
    }

    return Promise.resolve();
}
