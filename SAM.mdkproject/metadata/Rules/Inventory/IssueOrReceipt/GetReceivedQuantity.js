import libCom from '../../Common/Library/CommonLibrary';
import libLocal from '../../Common/Library/LocalizationLibrary';

export default function GetReceivedQuantity(context) {

    let type = context.binding && context.binding['@odata.type'].substring('#sap_mobile.'.length);
    let move = libCom.getStateVariable(context, 'IMMovementType');
    let parent = libCom.getStateVariable(context, 'IMObjectType');
    let binding = context.binding;
    let decimals = Number(context.getGlobalDefinition('/SAPAssetManager/Globals/Inventory/QuantityFieldDecimalPlacesAllowed.global').getValue());

    if (binding) {
        if (type === 'MaterialDocItem') {
            //Get from associated PO/STO/RESV line item
            const entryQuantity = binding.SerialNum.length ? 0 : binding.EntryQuantity;
            let isLocal = libCom.isCurrentReadLinkLocal(binding['@odata.readLink']);
            if (!isLocal || binding.SerialNum.length) {
                if (parent === 'REV') {
                    return libLocal.toNumber(context, context.formatNumber(entryQuantity, '', {maximumFractionDigits: decimals}));
                } else if (binding.StockTransportOrderItem_Nav) {
                    binding = binding.StockTransportOrderItem_Nav;
                    if (move === 'R') {
                        return libLocal.toNumber(context, context.formatNumber(Number(binding.IssuedQuantity - binding.ReceivedQuantity + entryQuantity), '', {maximumFractionDigits: decimals}));
                    }
                    return libLocal.toNumber(context, context.formatNumber(Number(binding.OrderQuantity - binding.IssuedQuantity + entryQuantity), '', {maximumFractionDigits: decimals}));
                } else if (binding.PurchaseOrderItem_Nav) {
                    binding = binding.PurchaseOrderItem_Nav;
                    return libLocal.toNumber(context, context.formatNumber(Number(binding.OpenQuantity + entryQuantity), '', {maximumFractionDigits: decimals})); 
                } else if (binding.ReservationItem_Nav || binding.ProductionOrderComponent_Nav) {
                    binding = binding.ReservationItem_Nav || binding.ProductionOrderComponent_Nav;
                    return libLocal.toNumber(context, context.formatNumber(Number(binding.RequirementQuantity + entryQuantity) - Number(binding.WithdrawalQuantity), '', {maximumFractionDigits: decimals})); 
                }
            }
            return libLocal.toNumber(context, context.formatNumber(Number(binding.EntryQuantity), '', {maximumFractionDigits: decimals}));
        } else if (type === 'PurchaseOrderItem' || type === 'ProductionOrderItem') {
            return libLocal.toNumber(context, context.formatNumber(Number(binding.OrderQuantity) - Number(binding.ReceivedQuantity), '', {maximumFractionDigits: decimals}));
        } else if (type === 'StockTransportOrderItem') {
            if (move === 'R') { //Receipt
                return libLocal.toNumber(context, context.formatNumber(Number(binding.IssuedQuantity) - Number(binding.ReceivedQuantity), '', {maximumFractionDigits: decimals}));
            }
            return libLocal.toNumber(context, context.formatNumber(Number(binding.OrderQuantity) - Number(binding.IssuedQuantity), '', {maximumFractionDigits: decimals})); //Issue
        } else if (type === 'ReservationItem' || type === 'ProductionOrderComponent') {
            return libLocal.toNumber(context, context.formatNumber(Number(binding.RequirementQuantity) - Number(binding.WithdrawalQuantity), '', {maximumFractionDigits: decimals}));
        } else if (type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem') {
            if (Number(binding.PickedQuantity) > 0) {
                return libLocal.toNumber(context, context.formatNumber(Number(binding.PickedQuantity), '', {maximumFractionDigits: decimals}));
            }
            return libLocal.toNumber(context, context.formatNumber(Number(binding.Quantity), '', {maximumFractionDigits: decimals}));
        }
    }
    
    return 0;
}
