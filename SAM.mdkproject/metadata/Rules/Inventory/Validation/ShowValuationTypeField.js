
export default function ShowValuationTypeField(context) {
    let binding = context.binding;
    if (binding) {
        let target = binding;
        let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem') {
            if (binding.PurchaseOrderItem_Nav) {
                target = binding.PurchaseOrderItem_Nav;
            } else if (binding.StockTransportOrderItem_Nav) {
                target = binding.StockTransportOrderItem_Nav;
            } else if (binding.ReservationItem_Nav) {
                target = binding.ReservationItem_Nav;
            } else if (binding.InboundDeliveryItem_Nav) {
                target = binding.InboundDeliveryItem_Nav;
            } else if (binding.OutboundDeliveryItem_Nav) {
                target = binding.OutboundDeliveryItem_Nav;
            } else if (binding.ProductionOrderComponent_Nav) {
                target = binding.ProductionOrderComponent_Nav;
            } else if (binding.ProductionOrderItem_Nav) {
                target = binding.ProductionOrderItem_Nav;
            }
        }
        let material = target.Material || target.MaterialNum;
        let plant = target.Plant || target.SupplyPlant || target.PlanningPlant;
        if (target.MaterialPlant_Nav) {
            let valCategory = target.MaterialPlant_Nav.ValuationCategory;
            if (valCategory) {
                return true;
            }
        } else if (type === 'MaterialDocItem' && binding.ValuationType) {
            return true;

        } else if (material && plant) {
            let query = `$filter=Plant eq '${plant}' and MaterialNum eq '${material}'`;
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialPlants', [], query).then((data) => {
                if (data.length === 1) {
                    let item = data.getItem(0);
                    return !!item.ValuationCategory;
                }
                return false;
            });
        }
        return false;
    }
    return false;
}
