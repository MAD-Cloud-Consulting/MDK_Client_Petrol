import ValidationLibrary from '../Common/Library/ValidationLibrary';

/**
 * Returns the equipment nav-link for this work order object list entry.
 * If there is no Equipment_Nav nav-link for this work order object, then the notification's equipment nav-link is used if it exists.
 * A work order object does not need to have an equipment. In that case, the workOrderObject.Equipment_Nav would be blank.
 *
 * @param {*} sectionedTableProxy Its binding object should the Work Order Object List record.
 */
export default function WorkOrderObjectEquipmentNavLink(sectionedTableProxy) {
    //let workOrder = sectionedTableProxy.getPageProxy().binding;
    let workOrderObject = sectionedTableProxy.binding;
    let equipNavLink = '';

    //First, check if Equipment_Nav link exists. If so, use it.
    equipNavLink = workOrderObject.Equipment_Nav;
    if (!ValidationLibrary.evalIsEmpty(equipNavLink)) {
        return workOrderObject['@odata.readLink'] + '/Equipment_Nav';
    }

    //Next, check if NotifHeader_Nav link exists. If so, use that to get to its equipment nav-link.
    if (!ValidationLibrary.evalIsEmpty(workOrderObject.NotifHeader_Nav)) {
        equipNavLink = workOrderObject.NotifHeader_Nav.Equipment;
        if (!ValidationLibrary.evalIsEmpty(equipNavLink)) {
            return workOrderObject.NotifHeader_Nav['@odata.readLink'] + '/Equipment';
        }
    }

    return workOrderObject['@odata.readLink'];
}
