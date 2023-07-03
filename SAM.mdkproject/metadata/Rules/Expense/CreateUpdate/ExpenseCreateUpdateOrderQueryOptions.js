import libVal from '../../Common/Library/ValidationLibrary';
import MobileStatusCompleted from '../../MobileStatus/MobileStatusCompleted';
import WorkOrdersFSMQueryOption from '../../WorkOrders/ListView/WorkOrdersFSMQueryOption';

export default function ExpenseCreateUpdateOrderQueryOptions(context) {
    let completedVariable = MobileStatusCompleted(context);
    return WorkOrdersFSMQueryOption(context).then(fsmQueryOptions => {
        let queryOptions = '$expand=OrderMobileStatus_Nav&';
        if (context.binding && context.binding.OrderId && context.binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') {
            queryOptions += `$filter=(OrderMobileStatus_Nav/MobileStatus ne '${completedVariable}' or OrderId eq '${context.binding.OrderId}')`;
        } else if (context.binding && context.binding.OrderID && context.binding['@odata.type'] === '#sap_mobile.Confirmation') {
            queryOptions += `$filter=(OrderMobileStatus_Nav/MobileStatus ne '${completedVariable}' or OrderId eq '${context.binding.OrderID}')`;
        } else {
            queryOptions += `$filter=OrderMobileStatus_Nav/MobileStatus ne '${completedVariable}'`;
        }
        if (!libVal.evalIsEmpty(fsmQueryOptions)) {
            queryOptions += ' and ' + fsmQueryOptions;
        }
        queryOptions += '&$orderby=OrderId asc';
        
        return queryOptions;
    });
}
