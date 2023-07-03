export default function EquipmentQueryOptions(context) {
    let binding = context.binding;
    if (binding && binding['@odata.type'] === '#sap_mobile.MyFunctionalLocation') {
        return binding['@odata.readLink'] + '/Equipments';
    } else {
        return 'MyEquipments';
    }
}
