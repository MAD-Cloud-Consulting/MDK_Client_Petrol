export default function POItemDetailsVisible(context) {
    return context.getPageProxy().binding['@odata.type'].includes('PurchaseOrderItem');
}
