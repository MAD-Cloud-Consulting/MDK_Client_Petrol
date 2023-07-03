import allowIssue from '../StockTransportOrder/AllowIssueForSTO';

export default function PurchaseOrderGoodsReceiptReceiveAllIsAllowed(context) {
    
    let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    let query;
    let target;

    if (type === 'PurchaseOrderHeader') {
        let poNumber = context.binding.PurchaseOrderId;
        query = "$filter=PurchaseOrderId eq '" + poNumber + "' and OpenQuantity gt 0 and DeliveryCompletedFlag ne 'X' and FinalDeliveryFlag ne 'X' and StorageLoc ne ''";
        target = 'PurchaseOrderItems';
    } else if (type === 'StockTransportOrderHeader') {
        if (!allowIssue(context)) {
            let poNumber = context.binding.StockTransportOrderId;
            query = "$filter=StockTransportOrderId eq '" + poNumber + "' and DeliveryCompletedFlag ne 'X' and FinalDeliveryFlag ne 'X' and StorageLoc ne ''";
            query += ' and (IssuedQuantity gt ReceivedQuantity)';
            target = 'StockTransportOrderItems';
        } else {
            return false; //This is an issue, not a receipt
        }
    }

    query += " and MaterialPlant_Nav/BatchIndicator eq '' and MaterialPlant_Nav/SerialNumberProfile eq ''";
    query += '&$top=1';

    //To allow auto receive, at least 1 line item must have all the following true:
    //Open quantity greater than zero
    //Cannot have delivery complete flag set
    //Storage location cannot be empty
    //Cannot be batch enabled material
    //Cannot be serialized material
    return context.read('/SAPAssetManager/Services/AssetManager.service', target, ['ItemNum'], query).then(function(results) {
        if (results && results.length > 0) {
            return true;
        }
        return false; //No items can be auto-received
    });
}
