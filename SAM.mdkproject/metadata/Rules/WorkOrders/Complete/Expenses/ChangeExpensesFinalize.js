import libCom from '../../../Common/Library/CommonLibrary';
import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function ChangeExpensesFinalize(context) {
    let expenses = libCom.getStateVariable(context, 'expenses');
    let data = {};
    data.value = combineExpenses(context, expenses);
    data.count = countExpenses(expenses);

    libCom.removeStateVariable(context, 'ExpenseListLoaded');
    WorkOrderCompletionLibrary.updateStepState(context, 'expenses', data);

    return WorkOrderCompletionLibrary.getInstance().openMainPage(context, false, {
        'Name': '/SAPAssetManager/Actions/WorkOrders/OpenCompleteWorkOrderPage.action',
        'Properties': {
            'ClearHistory': true,
            'Transition': {
                'Curve': 'EaseOut',
                'Name': 'SlideRight',
                'Duration': 0.5,
            },
        },
    });
}

function countExpenses(expenses) {
    return expenses.filter(expense => {
        return !expense.removed;
    }).length;
}

function combineExpenses(context, expenses) {
    let binding = libCom.getBindingObject(context);
    let currency = binding.OrderCurrency;
    let amount = 0;
    let count = 0;

    expenses.forEach(expense => {
        if (!expense.removed) {
            amount += expense.actualWork;
            count++;
        }
    });

    if (!count) return '';

    let label = count > 1 ? 'expenses_service' : 'expense';
    return count + ' ' + context.localizeText(label).toLowerCase() + ', ' +
        context.formatCurrency(amount, currency, '', {'maximumFractionDigits': 1, 'useGrouping': true});
}
