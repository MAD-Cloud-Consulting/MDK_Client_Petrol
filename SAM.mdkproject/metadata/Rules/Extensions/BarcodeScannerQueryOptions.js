import QueryBuilder from '../Common/Query/QueryBuilder';

export default function BarcodeScannerQueryOptions(context) {
    let queryBuilder = new QueryBuilder();

    let orderId = context.binding.OrderId;
    if (orderId) {
        queryBuilder.addFilter(`OrderId eq '${orderId}'`);
    }

    let entityType = context.binding['@odata.type'];

    if (entityType === '#sap_mobile.MyWorkOrderOperation') {
        queryBuilder.addFilter(`OperationNo eq '${context.binding.OperationNo}'`);
    }

    queryBuilder.addFilter('WithdrawnQuantity ne QuantityUnE');
    queryBuilder.addFilter("ItemCategory eq 'L'");
    queryBuilder.addExtra('orderby=ItemNumber');

    return queryBuilder.build();
}
