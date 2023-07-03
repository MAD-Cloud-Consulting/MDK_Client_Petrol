import ValidationLibrary from '../Common/Library/ValidationLibrary';

/**
 * Returns the equipment description for this work order object list entry.
 * If there is no Equipment_Nav nav-link for this work order object, then the notification's equipment link is checked next.
 * A work order object does not need to have an equipment. In that case, the workOrderObject.EquipId would be blank.
 *
 * @param {*} sectionedTableProxy 
 */
export default function WorkOrderObjectEquipmentDesc(sectionedTableProxy) {
    //let workOrder = sectionedTableProxy.getPageProxy().binding;
    let workOrderObject = sectionedTableProxy.binding;
    let equipDesc = '';
    let equipId = workOrderObject.EquipId;

    //First, check if Equipment_Nav link exists. If so, use it.
    if (!ValidationLibrary.evalIsEmpty(workOrderObject.Equipment_Nav)) {
        equipDesc = workOrderObject.Equipment_Nav.EquipDesc;
        if (!ValidationLibrary.evalIsEmpty(equipDesc)) {
            return equipDesc;
        }
    }

    //Next, check if NotifHeader_Nav link exists. If so, use that to get to its equipment and then get that equipment's description.
    if (!ValidationLibrary.evalIsEmpty(workOrderObject.NotifHeader_Nav)) {            
        equipId = workOrderObject.NotifHeader_Nav.HeaderEquipment;
        let equipNavLink = workOrderObject.NotifHeader_Nav.Equipment;
        if (!ValidationLibrary.evalIsEmpty(equipNavLink)) {
            equipDesc = equipNavLink.EquipDesc;
            if (!ValidationLibrary.evalIsEmpty(equipDesc)) {
                return equipDesc;
            }
        }
    }

    //We can't find the equipment description from the code above so return the equipment id if it exists. 
    if (!ValidationLibrary.evalIsEmpty(equipId)) {
        return equipId;
    } else {
        return '-';
    }
}
