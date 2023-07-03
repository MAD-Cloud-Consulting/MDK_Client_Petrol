/**
 * Gets the material description or returns a dash if not found.
 * context.binding should be a material or notification entityset object.
 * @param {*} context PageProxy or SectionProxy.
 */
export default function MaterialDescriptionValue(context) {

    let binding = context.binding;
    let materialDesc = '';

    if (binding['@odata.type'] === '#sap_mobile.MyNotificationHeader') {
        if (binding.Equipment && binding.Equipment.SerialNumber && binding.Equipment.SerialNumber.Material)
        materialDesc = binding.Equipment.SerialNumber.Material.Description;
    } else if (binding['@odata.type'] === '#sap_mobile.Material') {
        materialDesc = binding.Description;
    }

    if (materialDesc) {
        return materialDesc;
    } else {
        return '-';
    }
}
