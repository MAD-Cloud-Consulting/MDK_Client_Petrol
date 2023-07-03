export default function ItemFootnote(context) {
    const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    const item = context.getPageProxy().getClientData().item || context.binding;
    const physicType = 'PhysicalInventoryDocItem';

    if (type === physicType) {
        return item.Plant + '/' + item.StorLocation;
    }
}
