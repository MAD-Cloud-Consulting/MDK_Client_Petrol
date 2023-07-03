/**
 * 
 * Reload the material document item to get the current state
 */
 export default function ReloadMaterialDocumentItem(context, readLink) {  
    let query;

    if (readLink) {
        query = '$expand=AssociatedMaterialDoc,SerialNum,PurchaseOrderItem_Nav/POSerialNumber_Nav,PurchaseOrderItem_Nav/MaterialDocItem_Nav/SerialNum,StockTransportOrderItem_Nav/STOSerialNumber_Nav,StockTransportOrderItem_Nav/MaterialDocItem_Nav/SerialNum,ReservationItem_Nav,PurchaseOrderItem_Nav/MaterialPlant_Nav,StockTransportOrderItem_Nav/MaterialPlant_Nav,ReservationItem_Nav/MaterialPlant_Nav,StockTransportOrderItem_Nav/StockTransportOrderHeader_Nav,ReservationItem_Nav/ReservationHeader_Nav,ProductionOrderComponent_Nav/MaterialDocItem_Nav/SerialNum,ProductionOrderItem_Nav/MaterialDocItem_Nav/SerialNum';
        return context.read('/SAPAssetManager/Services/AssetManager.service', readLink, [], query).then(function(result) {
            return result.getItem(0);
        });
    }
    return Promise.resolve('');
 }
