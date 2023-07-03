export default function PhysicalInventoryItemDetailsVisible(context) {
    const type = context.getPageProxy().binding['@odata.type'].substring('#sap_mobile.'.length);
    const physicType = 'PhysicalInventoryDocItem';

    return type === physicType;
}
