export default function GetCostCenter(context) {
    let data = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().FixedData;
    let type;
    
    if (context.binding) {
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem') {
            return context.binding.CostCenter;
        } else if (type === 'ReservationItem') {
            return context.binding.ReservationHeader_Nav.CostCenter;
        }
    }
    if (data && data.cost_center) return data.cost_center;
    return '';
}
