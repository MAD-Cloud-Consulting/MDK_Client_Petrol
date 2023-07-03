export default function ItemSubHead(context) {
    const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    const item = context.getPageProxy().getClientData().item || context.binding;
    const physicType = 'PhysicalInventoryDocItem';
    const productionItemType = 'ProductionOrderItem';
    const productionCompType = 'ProductionOrderComponent';
    const reservationMT = ['201', '221', '261', '281'];

    if (type === 'ReservationItem') {
        return context.localizeText('reservation') + ' - ' + item.ReservationNum;
    } else if (type === 'PurchaseOrderItem') {
        return context.localizeText('purchase_order') + ' - ' + item.PurchaseOrderId;
    } else if (type === 'StockTransportOrderItem') {
        return context.localizeText('sto') + ' - ' + item.StockTransportOrderId;
    } else if (type === 'OutboundDeliveryItem') {
        return context.localizeText('outbound_delivery') + ' - ' + item.DeliveryNum;
    } else if (type === 'InboundDeliveryItem') {
        return context.localizeText('ibd_detail_title') + ' - ' + item.DeliveryNum;
    } else if (type === physicType) {
        return item.PhysInvDoc + '/' + item.FiscalYear;
    } else if (type === productionItemType) {
        return context.localizeText('production_order_label') + ' - ' + item.OrderId;
    } else if (type === productionCompType) {
        return context.localizeText('production_order_label') + ' - ' + item.OrderId;
    }

    if (type === 'MaterialDocItem') {
        if (item.MovementType === '101' && item.PurchaseOrderNumber || item.MovementType === '351' && item.PurchaseOrderNumber) {
            return item.PurchaseOrderNumber + '/' + item.PurchaseOrderItem;
        } else if (reservationMT.includes(item.MovementType) && item.ReservationNumber) {
            return item.ReservationNumber + '/' + item.ReservationItemNumber;
        }
    }
}
