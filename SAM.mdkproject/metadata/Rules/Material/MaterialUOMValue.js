/**
 * Gets the material base UOM or returns a dash if not found.
 * context.binding should be a material or notification entityset object.
 * @param {*} context PageProxy or SectionProxy.
 */
export default function MaterialUOMValue(context) {
    
    let binding = context.binding;
    let materialUOM = '';

    if (binding['@odata.type'] === '#sap_mobile.MyNotificationHeader') {
        if (binding.Equipment && binding.Equipment.SerialNumber && binding.Equipment.SerialNumber.Material)
        materialUOM = binding.Equipment.SerialNumber.Material.BaseUOM;
    } else if (binding['@odata.type'] === '#sap_mobile.Material') {
        materialUOM = binding.BaseUOM;
    }

    if (materialUOM) {
        return materialUOM;
    } else {
        return '-';
    }
}
