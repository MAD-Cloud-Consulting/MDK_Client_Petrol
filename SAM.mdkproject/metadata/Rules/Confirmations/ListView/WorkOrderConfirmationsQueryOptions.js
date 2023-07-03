import QueryBuilder from '../../Common/Query/QueryBuilder';
import DateBounds from '../ConfirmationDateBounds';
import commonLib from '../../Common/Library/CommonLibrary';


export default function WorkOrderConfirmationsQueryOptions(context) {

    let binding = context.getBindingObject();
    const mileageActivityType = commonLib.getMileageActivityType(context);
    const expenseActivityType = commonLib.getExpenseActivityType(context);

    let queryBuilder = new QueryBuilder();
    queryBuilder.addFilter(`OrderID eq '${binding.OrderId}'`);

    if (binding.OperationNo) {
        queryBuilder.addFilter(`Operation eq '${binding.OperationNo}'`);
    }

    queryBuilder.addAllExpandStatements(['WorkOrderHeader','AcctIndicator','Variance']);
    queryBuilder.addAllExpandStatements(['WorkOrderOperation','WorkOrderSubOperation']);
    queryBuilder.addAllExpandStatements(['WorkOrderHeader/OrderMobileStatus_Nav','WorkOrderOperation/OperationMobileStatus_Nav','WorkOrderSubOperation/SubOpMobileStatus_Nav']);

    let date = context.evaluateTargetPath('#Page:-Previous/#ClientData').PostingDate;
    if (date === undefined) {
        queryBuilder.addFilter('ActualDuration ne null');
    } else {
        let filter = '';
        let offsetInMinutes = new Date().getTimezoneOffset();
        let bounds = DateBounds(date);
        let lowerBound = bounds[0];
        let upperBound = bounds[1];

        if (offsetInMinutes !== 0) {
            filter = "StartTimeStamp ge datetime'" + lowerBound + "' and StartTimeStamp le datetime'" + upperBound + "'"; 
        } else {
            filter = "StartTimeStamp eq datetime'" + lowerBound+ "'";
        }
        
        queryBuilder.addFilter(filter);
    }
    if (commonLib.getPageName(context) === 'MileageListView' && mileageActivityType) {
       queryBuilder.addFilter(`ActivityType eq '${mileageActivityType}'`);
       queryBuilder.addExpandStatement('LongText');
    } else {
        if (mileageActivityType) {
            queryBuilder.addFilter(`ActivityType ne '${mileageActivityType}'`);
        }
    
        if (expenseActivityType) {
            queryBuilder.addFilter(`ActivityType ne '${expenseActivityType}'`);
        }
    }

    queryBuilder.addExtra('orderby=StartTimeStamp');

    return queryBuilder.build();
}
