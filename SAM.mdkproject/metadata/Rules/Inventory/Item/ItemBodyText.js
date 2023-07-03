export default function ItemBodyText(context) {
    const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    const item = context.getPageProxy().getClientData().item || context.binding;
    const physicType = 'PhysicalInventoryDocItem';

    if (type === physicType) {
        if (item.ItemCounted) {
            return context.localizeText('counted');
        } else {
            return context.localizeText('pi_uncounted');
        }
    }
}
