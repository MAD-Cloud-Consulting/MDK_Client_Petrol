import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import QueryBuilder from '../../Common/Query/QueryBuilder';
import MobileStatusCompleted from '../../MobileStatus/MobileStatusCompleted';

export default function MileageAddEditOperationQueryOptionsQueryBuilder(context, orderId) {
    let queryBuilder = new QueryBuilder();

    queryBuilder.addFilter(`OrderId eq '${orderId}'`);
    queryBuilder.addAllSelectStatements(['OperationNo', 'OperationShortText']);
    queryBuilder.addExtra('orderby=OperationNo');

    if (MobileStatusLibrary.isOperationStatusChangeable(context)) {
        queryBuilder.addExpandStatement('OperationMobileStatus_Nav');
        if (context.binding && context.binding.OperationNo) {
            queryBuilder.addFilter(`(OperationMobileStatus_Nav/MobileStatus ne '${MobileStatusCompleted(context)}' or OperationNo eq '${context.binding.OperationNo}')`);
        } else if (context.binding && context.binding.Operation) {
            queryBuilder.addFilter(`(OperationMobileStatus_Nav/MobileStatus ne '${MobileStatusCompleted(context)}' or OperationNo eq '${context.binding.Operation}')`);
        } else {
            queryBuilder.addFilter(`OperationMobileStatus_Nav/MobileStatus ne '${MobileStatusCompleted(context)}'`);
        }
       
        return Promise.resolve(queryBuilder.build());
    } else { //Header level assignment type so need to check for confirmed status
        return MobileStatusLibrary.getAllConfirmationsForWorkorderForOperation(context, orderId).then(allConfirmations => {
            let grouped = MobileStatusLibrary.groupByOperation(allConfirmations, confirmation => confirmation.Operation);
            let iterator1 = grouped[Symbol.iterator]();

            for (let [key, value] of iterator1) {
                if (value.FinalConfirmation === '') {
                    queryBuilder.addFilter(`OperationNo eq '${key}'`);
                }
            }
            return queryBuilder.build();
        });
    }
}
