import { OperationConstants as Constants } from '../../../WorkOrders/Operations/WorkOrderOperationLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function OperationQueryOptions(context) {
    return Constants.FromWOrkOrderOperationListQueryOptions(context, false) + `&$filter=OrderId eq '${context.binding.OrderId}' and OperationNo eq '${context.binding.OperationNo}'`;
}
