import GetMaterialName from '../PurchaseOrder/GetMaterialName';

export default function GetMaterialDesc(context, item) {
    const binding = item || context.binding;
    if (!binding.Material) {
        if (binding.PurchaseOrderItem_Nav) {
            return binding.PurchaseOrderItem_Nav.ItemText;
        } else if (binding.StockTransportOrderItem_Nav) {
            return binding.StockTransportOrderItem_Nav.ItemText;
        }
    }
    return GetMaterialName(context, binding);
}
