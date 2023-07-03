
export default function SubEquipmentListViewEntitySet(context) {
    let odataType = context.getPageProxy().binding['@odata.type'];
    if (odataType === '#sap_mobile.MyFunctionalLocation') {
        return context.getPageProxy().binding['@odata.readLink'] + '/Equipments';
    } else if (odataType === '#sap_mobile.MyEquipment') {
        return 'MyEquipments';
    }
}
