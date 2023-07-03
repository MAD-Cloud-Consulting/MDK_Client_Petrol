/**
 * Returns the description for a material depending on the source entity.
 * @param {IClientAPI} context
 */
export default function ObjectListMaterialDescription(context) {

    let binding = context.binding;
    let materialDesc = '-';

    if (binding['@odata.type'] === '#sap_mobile.MyNotificationHeader') {
        if (binding.Equipment && binding.Equipment.SerialNumber && binding.Equipment.SerialNumber.Material)
        materialDesc = binding.Equipment.SerialNumber.Material.Description;
    } else if (binding['@odata.type'] === '#sap_mobile.Material') {
        materialDesc = binding.Description;
    }
    return materialDesc;    

}
