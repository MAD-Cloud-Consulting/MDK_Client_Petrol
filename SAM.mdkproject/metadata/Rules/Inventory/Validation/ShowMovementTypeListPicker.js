
export default function ShowMovementTypeListPicker(context) {
    if (context.binding) {
        let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    
        if (type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem') {
            return false;
        }
    }
    return true;
}
