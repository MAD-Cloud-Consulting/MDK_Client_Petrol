import GetMaterialNumMaterialDocItem from '../SerialNumbers/GetMaterialNumMaterialDocItem';

export default function ItemSerialNumbersTarget(context) {
    const binding = context.getPageProxy().getClientData().item || context.binding;
    const type = binding['@odata.type'].substring('#sap_mobile.'.length);
    const physicType = 'PhysicalInventoryDocItem';
    let arr = [];
    if (type === 'PurchaseOrderItem') {
        arr = binding.POSerialNumber_Nav;
        return GetMaterialNumMaterialDocItem(binding, arr);
    } else if (type === 'StockTransportOrderItem') {
        arr = binding.STOSerialNumber_Nav;
        return GetMaterialNumMaterialDocItem(binding, arr, true);
    } else if (type === 'MaterialDocItem') {
        return binding.SerialNum.map(item => {
            return {SerialNumber: item.SerialNum};
        });
    } else if (type === 'InboundDeliveryItem') {
        return binding.InboundDeliverySerial_Nav;
    } else if (type === 'OutboundDeliveryItem') {
        return binding.OutboundDeliverySerial_Nav;
    } else if (type === physicType) {
        return binding.PhysicalInventoryDocItemSerial_Nav;
    }
}
