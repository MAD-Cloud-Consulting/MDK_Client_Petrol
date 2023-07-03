export default function SerialNumbersItemNumberVisible(context) {
    let binding = context.binding;
    if (!binding) {
        return false;
    }
    const type = binding['@odata.type'].substring('#sap_mobile.'.length);

    return type === 'PurchaseOrderItem' || type === 'StockTransportOrderItem' || type === 'ReservationItem' || type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem';
}
