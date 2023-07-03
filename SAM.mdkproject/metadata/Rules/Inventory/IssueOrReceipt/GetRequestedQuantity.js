import libCom from '../../Common/Library/CommonLibrary';

export default function GetRequestedQuantity(context) {

    let binding;
    let decimals = Number(context.getGlobalDefinition('/SAPAssetManager/Globals/Inventory/QuantityFieldDecimalPlacesAllowed.global').getValue());
    
    if (context.binding) {
        let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        let move = libCom.getStateVariable(context, 'IMMovementType');
        let parent = libCom.getStateVariable(context, 'IMObjectType');

        if (type === 'MaterialDocItem') { //Redirect binding to point to the underlying inventory object
            if (parent === 'REV') {
                binding = context.binding;
                type = 'Reversal';
            } else if (context.binding.PurchaseOrderItem_Nav) {
                binding = context.binding.PurchaseOrderItem_Nav;
                type = 'PurchaseOrderItem';
            } else if (context.binding.StockTransportOrderItem_Nav) {
                binding = context.binding.StockTransportOrderItem_Nav;
                type = 'StockTransportOrderItem';
            } else if (context.binding.ReservationItem_Nav) {
                binding = context.binding.ReservationItem_Nav;
                type = 'ReservationItem';
            } else if (context.binding.ProductionOrderComponent_Nav) {
                binding = context.binding.ProductionOrderComponent_Nav;
                type = 'ProductionOrderComponent';
            } else if (context.binding.ProductionOrderItem_Nav) {
                binding = context.binding.ProductionOrderItem_Nav;
                type = 'ProductionOrderItem';
            }
        } else {
            binding = context.binding; //Use the inventory object we already have
        }

        if (type === 'PurchaseOrderItem' || type === 'ProductionOrderItem') {
            return context.formatNumber(Number(binding.OrderQuantity), '', {maximumFractionDigits: decimals}) + ' ' + binding.OrderUOM;
        } else if (type === 'StockTransportOrderItem') {
            if (move === 'R') { //Receipt
                return context.formatNumber(Number(binding.IssuedQuantity), '', {maximumFractionDigits: decimals}) + ' ' + binding.OrderUOM;
            }
            return context.formatNumber(Number(binding.OrderQuantity), '', {maximumFractionDigits: decimals}) + ' ' + binding.OrderUOM; //Issue
        } else if (type === 'ReservationItem' || type === 'ProductionOrderComponent') {
            return context.formatNumber(Number(binding.RequirementQuantity), '', {maximumFractionDigits: decimals}) + ' ' + binding.RequirementUOM;
        } else if (type === 'InboundDeliveryItem') {
            return context.formatNumber(Number(binding.Quantity), '', {maximumFractionDigits: decimals}) + ' ' + binding.UOM;
        } else if (type === 'Reversal') {
            return context.formatNumber(Number(binding.EntryQuantity), '', {maximumFractionDigits: decimals}) + ' ' + binding.EntryUOM;
        }
    }
    return '0';
}
