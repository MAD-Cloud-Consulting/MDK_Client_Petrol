import QueryBuilder from '../Common/Query/QueryBuilder';

export default function PartsCount(clientAPI) {
    let queryBuilder = new QueryBuilder();
    let binding = clientAPI.getPageProxy().binding;
    let orderId = binding.OrderId;
    let operationNo = binding.OperationNo;

    if (orderId) {
        queryBuilder.addFilter(`OrderId eq '${orderId}'`);
    }

    if (operationNo) {
        queryBuilder.addFilter(`OperationNo eq '${operationNo}'`);
    }

    return clientAPI.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderComponents', queryBuilder.build());
}
