
export default function SubEquipmentListViewQueryOptions(context) {
    let odataType = context.getPageProxy().binding['@odata.type'];
    if (odataType === '#sap_mobile.MyFunctionalLocation') {
        return '$expand=ObjectStatus_Nav/SystemStatus_Nav,EquipDocuments,EquipDocuments/Document';
    } else if (odataType === '#sap_mobile.MyEquipment') {
        let equipId = context.getPageProxy().binding.EquipId;
        return `$filter=SuperiorEquip eq '${equipId}'&$expand=ObjectStatus_Nav/SystemStatus_Nav,EquipDocuments,EquipDocuments/Document`;
    }
}
