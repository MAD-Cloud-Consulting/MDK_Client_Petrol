/**
 * Gets the material type or returns a dash if not found.
 * context.binding should be a material or notification entityset object.
 * @param {*} context PageProxy or SectionProxy.
 */
export default function MaterialTypeValue(context) {
    
    let binding = context.binding;
    let materialType = '';

    if (binding['@odata.type'] === '#sap_mobile.MyNotificationHeader') {
        if (binding.Equipment && binding.Equipment.SerialNumber && binding.Equipment.SerialNumber.Material)
        materialType = binding.Equipment.SerialNumber.Material.MaterialType;
    } else if (binding['@odata.type'] === '#sap_mobile.Material') {
        materialType = binding.MaterialType;
    }

    if (materialType) {
        return materialType;
    } else {
        return '-';
    }
}
