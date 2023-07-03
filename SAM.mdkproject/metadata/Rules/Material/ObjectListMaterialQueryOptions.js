/**
 * Returns the correct query options for the material and serial number for an equipment.
 * If there is a notification on this object list row, get the equipment material from that object
 * @param {IClientAPI} context
 */
export default function ObjectListMaterialQueryOptions(context) {

    let binding = context.getPageProxy().binding;

    if (binding.Material_Nav) { //No Notification
        return '$expand=WOObjectList_Nav';
    }
    let notif = binding.NotifHeader_Nav; //Make sure there is a notification with a material attached
    if (notif && notif.Equipment && notif.Equipment.SerialNumber && notif.Equipment.SerialNumber.Material) {
        return '$expand=Equipment,Equipment/SerialNumber,Equipment/SerialNumber/Material&$select=Equipment/EquipId'; //Using Notification's equipment
    } else {
        return '';
    }

}
