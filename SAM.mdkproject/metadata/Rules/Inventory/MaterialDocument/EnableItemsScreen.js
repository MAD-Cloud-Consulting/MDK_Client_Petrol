import libCom from '../../Common/Library/CommonLibrary';

export default function EnableItemsScreen(context) {
    let binding = context.binding;
    if (binding) {
        if (!binding.MovementType) {
            binding = binding.RelatedItem[0];
        }
        if (!binding.PurchaseOrder_Nav && !binding.STO_Nav && !binding.ProductionOrderItem_Nav && !binding.ProductionOrderComponent_Nav && !binding.Reservation_Nav) {
            return libCom.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
        }
    }
    return false;
}
