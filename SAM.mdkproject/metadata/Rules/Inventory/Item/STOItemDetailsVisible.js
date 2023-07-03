export default function STOItemDetailsVisible(context) {
    return context.getPageProxy().binding['@odata.type'].includes('StockTransportOrderItem');
}
