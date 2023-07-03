export default function ItemCaption(context) {
    const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    const physicType = 'PhysicalInventoryDocItem';

    if (type === 'PurchaseOrderItem' || type === 'StockTransportOrderItem' || type === 'ReservationItem') {
        return context.localizeText('item_item_number', [context.binding.ItemNum]);
    } else if (type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem' || type === physicType) {
        return context.localizeText('item_item_number', [context.binding.Item]);
    } else if (type === 'MaterialDocItem') {
        return context.localizeText('material_document_item_number', [context.binding.MatDocItem]);
    } 
}
