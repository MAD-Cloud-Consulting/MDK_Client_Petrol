/**
 * Returns the number for a material depending on the source entity.
 * @param {IClientAPI} context
 */
export default function ObjectListMaterialNumber(context) {

    let binding = context.binding;
    let materialNum = '-';

    if (binding['@odata.type'] === '#sap_mobile.MyNotificationHeader') {
        if (binding.Equipment && binding.Equipment.SerialNumber && binding.Equipment.SerialNumber.Material)
        materialNum = binding.Equipment.SerialNumber.Material.MaterialNum;
    } else if (binding['@odata.type'] === '#sap_mobile.Material') {
        materialNum = binding.MaterialNum;
    }
    return materialNum;    

}
