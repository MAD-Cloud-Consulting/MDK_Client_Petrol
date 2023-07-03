export default function AddEditDocumentCaption(context) {
    let binding = context.binding;
    let odataType = binding['@odata.type'];
    if (odataType === '#sap_mobile.MyEquipment') {
        return context.localizeText('edit_equipment');
    } else if (odataType === '#sap_mobile.MyFunctionalLocation') {
        return context.localizeText('edit_functional_location');
    }
}
