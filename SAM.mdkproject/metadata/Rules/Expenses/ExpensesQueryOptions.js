import libCommon from '../Common/Library/CommonLibrary';
import QueryBuilder from '../Common/Query/QueryBuilder';

export default function ExpensesQueryOption(context) {
    let queryBuilder = new QueryBuilder();
    const activityType = libCommon.getExpenseActivityType(context);

    if (activityType) {
        queryBuilder.addFilter(`ActivityType eq '${activityType}'`);
    }

    if (context.binding && context.binding.OrderId) {
        queryBuilder.addFilter(`OrderID eq '${context.binding.OrderId}'`);

        if (context.binding.OperationNo) {//Inside an operation
            queryBuilder.addFilter(`Operation eq '${context.binding.OperationNo}'`);
        }
    }

    return queryBuilder.build();
}
