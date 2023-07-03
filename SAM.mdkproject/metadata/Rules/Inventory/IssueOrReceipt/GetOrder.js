export default function GetOrder(context) {
    let data = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().FixedData;

    let type;
    
    if (context.binding) {
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem') {
            return context.binding.OrderNumber;
        } else if (type === 'ReservationItem' || type === 'ProductionOrderComponent') {
            return context.binding.OrderId;
        }
    }
    if (data && data.order) return data.order;
    return '';
}
