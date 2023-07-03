export default function OutboundInboundItemDetailsVisible(context) {
    const isDelivery = context.getPageProxy().binding['@odata.type'].includes('DeliveryItem');
    // PRD item uses same data fields as delivery items, so using it there
    const idPRDItem = context.getPageProxy().binding['@odata.type'].includes('ProductionOrderItem');
    return isDelivery || idPRDItem;
}
