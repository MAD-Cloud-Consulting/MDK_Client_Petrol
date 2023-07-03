import getItemsCountLabel from '../MaterialDocument/GetItemsCountLabel';
import getComponentsCount from '../ProductionOrder/GetComponentsCount';
import allowIssue from '../StockTransportOrder/AllowIssueForSTO';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function DocumentItemsCountCaption(context) {
    let binding = context.binding;
    if (binding) {
        let id = binding['@odata.readLink'];
        let entitySet;
        let completedQuery = '$filter=';

        if (binding.PurchaseOrderHeader_Nav) {
            entitySet = id + '/PurchaseOrderHeader_Nav/PurchaseOrderItem_Nav';
            completedQuery += "FinalDeliveryFlag eq 'X' or DeliveryCompletedFlag eq 'X' or (ReceivedQuantity eq OrderQuantity)";
        } else if (binding.PhysicalInventoryDocHeader_Nav) {
            entitySet = id + '/PhysicalInventoryDocHeader_Nav/PhysicalInventoryDocItem_Nav';
            completedQuery += "EntryQuantity gt 0 or ZeroCount eq 'X'";
        } else if (binding.ProductionOrderHeader_Nav) {
            // need new label, so calling function for Production Order
            return getComponentsCount(context, binding.ProductionOrderHeader_Nav);
        } else if (binding.MaterialDocument_Nav) {
            // need single item label, so calling function for MDoc
            return getItemsCountLabel(context, binding.MaterialDocument_Nav);
        } else if (binding.InboundDelivery_Nav) {
            entitySet = id + '/InboundDelivery_Nav/Items_Nav';
            completedQuery += 'PickedQuantity eq Quantity';
        } else if (binding.StockTransportOrderHeader_Nav) {
            entitySet = id + '/StockTransportOrderHeader_Nav/StockTransportOrderItem_Nav';
            if (allowIssue(binding.StockTransportOrderHeader_Nav)) {
                completedQuery += "FinalDeliveryFlag eq 'X' or DeliveryCompletedFlag eq 'X' or (IssuedQuantity eq OrderQuantity)";
            } else { //Receipt
                completedQuery += "FinalDeliveryFlag eq 'X' or DeliveryCompletedFlag eq 'X' or (IssuedQuantity eq ReceivedQuantity and IssuedQuantity gt 0)";
            }
        } else if (binding.OutboundDelivery_Nav) {
            entitySet = id + '/OutboundDelivery_Nav/Items_Nav';
            completedQuery += 'PickedQuantity eq Quantity';
        } else if (binding.ReservationHeader_Nav) {
            entitySet = id + '/ReservationHeader_Nav/ReservationItem_Nav';
            completedQuery += "(RequirementQuantity eq WithdrawalQuantity) or Completed eq 'X'";
        }
        if (entitySet) {
            let getFullCount = context.count('/SAPAssetManager/Services/AssetManager.service', entitySet, '');
            let getCompletedCount = context.count('/SAPAssetManager/Services/AssetManager.service', entitySet, completedQuery);
            return Promise.all([getCompletedCount, getFullCount]).then(result => {
                return context.localizeText('item_open_quantities', [result[0], result[1], context.localizeText('items')]);
            });
        }
    }
    return '';
}
