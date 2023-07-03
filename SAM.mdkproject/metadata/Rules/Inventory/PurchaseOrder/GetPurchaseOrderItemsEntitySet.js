/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function GetPurchaseOrderItemsEntitySet(context) {
    let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    if (type === 'StockTransportOrderHeader') {
        return 'StockTransportOrderItems';
    } else if (type === 'ReservationHeader') {
        return 'ReservationItems';
    } else if (type === 'ProductionOrderHeader') {
        return 'ProductionOrderItems';
    } else 
        return 'PurchaseOrderItems';
}
