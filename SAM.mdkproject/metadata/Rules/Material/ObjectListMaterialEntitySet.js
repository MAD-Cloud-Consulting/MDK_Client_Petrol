/**
 * Returns the correct entityset for finding the material and serial number for an equipment.
 * If there is a notification on this object list row, get the equipment material from that object
 * @param {IClientAPI} context
 */
export default function ObjectListMaterialEntitySet(context) {

    let binding = context.getPageProxy().binding;

    if (binding.Material_Nav) {
        return binding['@odata.readLink'] + '/Material_Nav';
    }
    let notif = binding.NotifHeader_Nav; //Make sure there is a notification with a material attached
    if (notif && notif.Equipment && notif.Equipment.SerialNumber && notif.Equipment.SerialNumber.Material) {
        return binding['@odata.readLink'] + '/NotifHeader_Nav';
    } else {
        return binding['@odata.readLink'];
    }

}
