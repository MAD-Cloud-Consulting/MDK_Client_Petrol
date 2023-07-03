import commonLib from '../../Common/Library/CommonLibrary';

export default function CreatedExpensesQueryOptions(context) {
    let options = '$filter=sap.islocal()';
    let activityType = (context.binding && context.binding.activityType) || commonLib.getExpenseActivityType(context);

    if (activityType) {
        options += ` and ActivityType eq '${activityType}'`;
    }

    let orderId = context.binding ? context.binding.OrderID || context.binding.OrderId : '';
    if (orderId) {
        options += ` and OrderID eq '${orderId}'`;
    }

    let expenses = commonLib.getStateVariable(context, 'expenses');
    if (expenses && expenses.length) {
        options += ' and (';
        expenses.forEach((expense, index) => {
            if (index === 0) {
                options += `ConfirmationNum eq '${expense.localConfirmationNum}'`;
            } else {
                options += ` or ConfirmationNum eq '${expense.localConfirmationNum}'`;
            }
        });

        options += ') and (';

        expenses.forEach((expense, index) => {
            if (index === 0) {
                options += `ConfirmationCounter eq '${expense.localConfirmationCounter}'`;
            } else {
                options += ` or ConfirmationCounter eq '${expense.localConfirmationCounter}'`;
            }
        });

        options += ')';
    }

    return options;
}
