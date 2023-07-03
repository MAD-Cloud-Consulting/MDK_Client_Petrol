export default function GetBatch(context) {
    let type;
    
    if (context.binding) {
        let binding = context.binding;
        type = binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem' || type === 'ReservationItem' || type === 'OutboundDeliveryItem' || type === 'InboundDeliveryItem' || type === 'ProductionOrderComponent' || type === 'ProductionOrderItem') {
            return binding.Batch;
        } else if (type === 'PurchaseOrderItem') {
            if (binding.ScheduleLine_Nav && binding.ScheduleLine_Nav.length > 0) {
                return binding.ScheduleLine_Nav[0].Batch;
            }
        } else if (type === 'StockTransportOrderItem') {
            if (binding.STOScheduleLine_Nav && binding.STOScheduleLine_Nav.length > 0) {
                return binding.STOScheduleLine_Nav[0].Batch;
            }
        }
    }
    return ''; //If not editing an existing local receipt item and no item default, then set to empty
}
