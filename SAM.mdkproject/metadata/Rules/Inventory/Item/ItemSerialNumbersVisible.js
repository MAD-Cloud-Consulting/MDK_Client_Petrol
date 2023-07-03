export default function ItemSerialNumbersVisible(context) {
    const type = context.getPageProxy().binding['@odata.type'].substring('#sap_mobile.'.length);
    const physicType = 'PhysicalInventoryDocItem';
    const item = context.getPageProxy().getClientData().item || context.getPageProxy().binding;

    if (type === physicType) {
        return !item.ZeroCount && !!item.ItemCounted;
    }

    return type !== 'ReservationItem';
}
