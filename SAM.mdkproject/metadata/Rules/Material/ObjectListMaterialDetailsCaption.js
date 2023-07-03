/**
 * Creates the caption label for the ObjectListMaterialDetails.page.
 * Adds the material number to the caption if it exits.
 * @param {*} pageProxy Binding object should be the material entityset object, or a notification.
 */
export default function ObjectListMaterialDetailsCaption(pageProxy) {

    let binding = pageProxy.binding;
    let materialNum = '';

    if (binding['@odata.type'] === '#sap_mobile.MyNotificationHeader') {
        if (binding.Equipment && binding.Equipment.SerialNumber && binding.Equipment.SerialNumber.Material)
        materialNum = binding.Equipment.SerialNumber.Material.MaterialNum;
    } else if (binding['@odata.type'] === '#sap_mobile.Material') {
        materialNum = binding.MaterialNum;
    }

    return pageProxy.localizeText('material_x', [materialNum]);
}
