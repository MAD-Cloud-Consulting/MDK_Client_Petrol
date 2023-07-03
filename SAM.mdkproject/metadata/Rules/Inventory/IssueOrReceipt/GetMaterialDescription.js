import materialName from '../PurchaseOrder/GetMaterialName';
import GetItemTextOrMaterialName from '../PurchaseOrder/GetItemTextOrMaterialName';

export default function GetMaterialDescription(context, dividerStr = '') {
    if (context.binding) {
        const binding = context.binding;
        const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);

        if (type === 'MaterialDocItem') {
            if (!binding.Material) {
                if (binding.PurchaseOrderItem_Nav) {
                    return binding.PurchaseOrderItem_Nav.ItemText;
                } else if (binding.StockTransportOrderItem_Nav) {
                    return binding.StockTransportOrderItem_Nav.ItemText;
                }
            }
        } else if (type === 'PurchaseOrderItem' || type === 'ReservationItem' || type === 'StockTransportOrderItem' || type === 'ProductionOrderComponent') {
            return GetItemTextOrMaterialName(context);
        }

        return materialName(context).then((result) => {
            if (result && dividerStr.length === 0) {                
                dividerStr = ' - ';
            }
            if (type === 'MaterialDocItem'  || type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem' || type === 'PhysicalInventoryDocItem') {
                return binding.Material + dividerStr + result;
            }
            return binding.MaterialNum + dividerStr + result;
        });
    }
    return '';
}
