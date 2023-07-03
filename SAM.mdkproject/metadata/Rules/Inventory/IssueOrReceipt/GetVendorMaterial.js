export default function GetVendorMaterial(context) {
    let type;
    
    if (context.binding) {
        type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem') {
            return ''; //TODO - need to get this from PO line item
        } else if (type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem') {
            return context.binding.Material;
        }
        return context.binding.SupplierMaterialNum;
    }
    return '';
}
