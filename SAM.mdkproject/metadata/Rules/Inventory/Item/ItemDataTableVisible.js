export default function ItemDataTableVisible(context) {
    const type = context.getPageProxy().binding['@odata.type'].substring('#sap_mobile.'.length);
    const item = context.getPageProxy().getClientData().item || context.getPageProxy().binding;
    const physicType = 'PhysicalInventoryDocItem';

    if (item.MaterialDocItem_Nav) {
        return !!item.MaterialDocItem_Nav.length;
    }

    return type !== 'MaterialDocItem' && type !== 'InboundDeliveryItem' && type !== 'OutboundDeliveryItem' && type !== physicType;
}
