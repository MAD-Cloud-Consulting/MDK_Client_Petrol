/**
 * Gets the object list material description by using the Material_Nav navlink from MyWorkOrderObjectLists entityset record.
 * Returns dash if description isn't found. 
 * @param {*} context PageProxy or SectionProxy. Its binding object should be the MyWorkOrderObjectLists entityset object.
 */
export default function ObjectListMaterialDesc(context) {
    let workOrderObjectList = context.binding;    
    let material = workOrderObjectList.Material_Nav;
    if (material) {
        let materialDesc = material.Description;
        if (materialDesc) {
            return materialDesc;
        }
    }
    //Next, check if NotifHeader_Nav link exists. If so, use that to get to its equipment and then get that equipment's material info
    let notif = workOrderObjectList.NotifHeader_Nav;          
    if (notif && notif.Equipment && notif.Equipment.SerialNumber && notif.Equipment.SerialNumber.Material) {
        let materialDesc = notif.Equipment.SerialNumber.Material.Description;
        if (materialDesc) {
            return materialDesc;
        }
    }
    return '-';
}
