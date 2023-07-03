import QueryBuilder from '../../Common/Query/QueryBuilder';
import FetchRequest from '../../Common/Query/FetchRequest';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function MileageTotalDuration(context) {
    let queryBuilder = new QueryBuilder();
    let orderId = context.getPageProxy().binding.OrderId;
    const mileageActivityType = CommonLibrary.getMileageActivityType(context);

    queryBuilder.addFilter(`OrderID eq '${orderId}'`);
    
    if (mileageActivityType) {
        queryBuilder.addFilter(`ActivityType eq '${mileageActivityType}'`);
    }

    let fetchRequest = new FetchRequest('Confirmations', queryBuilder.build());

    return fetchRequest.execute(context).then(result => {
        return calculateTotal(result);
    });  
}

function calculateTotal(confirmations) {
    let total = 0;
    if (confirmations !== undefined) {
        confirmations.forEach(conf => {
            total += conf.ActualWork;
        });
    }
    return total;
}
