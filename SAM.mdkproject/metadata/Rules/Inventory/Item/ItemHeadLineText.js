import GetMaterialName from '../../Common/GetMaterialName';

export default function ItemHeadLineText(context) {
    const item = context.getPageProxy().getClientData().item || context.binding;
    const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    const physicType = 'PhysicalInventoryDocItem';
    if (type === 'PurchaseOrderItem' || type === 'StockTransportOrderItem') {
        return item.ItemText;
    } else if (type === 'MaterialDocItem') {
        return item.MaterialDocNumber;
    } else if (type === physicType) {
        return item.Material + ' - ' + item.Material_Nav.Description;
    } else {
        return GetMaterialName(context, item);
    }
}
