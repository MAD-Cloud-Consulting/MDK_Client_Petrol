import QueryBuilder from '../../Common/Query/QueryBuilder';
import FetchRequest from '../../Common/Query/FetchRequest';
import CommonLibrary from '../../Common/Library/CommonLibrary';


export default function WorkOrderConfirmationsCount(context, isPageProxy = false) {

    if (!isPageProxy) {
        context = context.getPageProxy();
    }

    let binding = context.getBindingObject();
    const mileageActivityType = CommonLibrary.getMileageActivityType(context);
    const expenseActivityType = CommonLibrary.getExpenseActivityType(context);

    let queryBuilder = new QueryBuilder();
    queryBuilder.addFilter(`OrderID eq '${binding.OrderId}'`);
    queryBuilder.addFilter('ActualDuration ne null');
    queryBuilder.addExtra('orderby=OrderID desc');
    if (mileageActivityType) {
        queryBuilder.addFilter(`ActivityType ne '${mileageActivityType}'`);
    }

    if (expenseActivityType) {
        queryBuilder.addFilter(`ActivityType ne '${expenseActivityType}'`);
    }

    let fetchRequest = new FetchRequest('Confirmations', queryBuilder.build());

    return fetchRequest.count(context).then(result => {
        return result;
    });    
}
