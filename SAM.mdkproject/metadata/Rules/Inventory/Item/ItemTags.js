import GetPOItemState from '../PurchaseOrder/GetPOItemState';
import GetInboundOrOutboundItemState from '../InboundOrOutbound/GetInboundOrOutboundItemState';

export default function ItemTags(context) {
    const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    const item = context.getPageProxy().getClientData().item || context.binding;
    const reservationMT = ['201', '221', '261', '281'];
    const stockTransferMT = ['301', '311'];
    const physicType = 'PhysicalInventoryDocItem';

    if (type === 'MaterialDocItem') {
        const tags = [item.MovementType];
        if (item.MovementType === '101' && item.PurchaseOrderNumber) {
            tags.push(context.localizeText('purchase_order'));
        } else if (item.MovementType === '351' && item.PurchaseOrderNumber) {
            tags.push(context.localizeText('sto'));
        } else if (reservationMT.includes(item.MovementType)) {
            if (item.ReservationNumber) tags.push(context.localizeText('reservation'));
            else tags.push(context.localizeText('goods_issue_other'));
        } else if (stockTransferMT.includes(item.MovementType)) {
            tags.push(context.localizeText('stock_transfer'));
        } else if (item.MovementType === '501') {
            tags.push(context.localizeText('goods_recipient_other'));
        }

        return tags;
    
    } else if (type.includes('DeliveryItem')) {
        return [GetInboundOrOutboundItemState(context)];
    } else if (type === physicType) {
        return [];
    } else return [GetPOItemState(context)];
}
