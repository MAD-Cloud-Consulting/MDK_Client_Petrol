export default function DocumentAddEdit(context) {
    let binding = context.binding;
    let odataType = binding['@odata.type'];
    if (odataType === '#sap_mobile.MyEquipment') {
        return 'MyEquipments';
    } else if (odataType === '#sap_mobile.MyFunctionalLocation') {
        return 'MyFunctionalLocations';
    } 
}
