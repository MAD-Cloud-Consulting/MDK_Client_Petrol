import ValidationLibrary from '../Common/Library/ValidationLibrary';

/**
 * Returns the nav-link of the functional location for the work order object.
 * If there is no functional location nav-link for this work order object, then the equipment is checked next. If the equipment has a FLOC then it's nav-link is used.
 * If the equipment does not have a FLOC, then the notification is checked for a FLOC. If that does not exist, then the notification's equipment is checked for the FLOC nav-link.
 * A work order object does not need to have a FLOC. In that case, a blank is returned.
 *
 * @param {*} sectionedTableProxy 
 */
export default function WorkOrderObjectFuncLocNavLink(sectionedTableProxy) {

    //let workOrder = sectionedTableProxy.getPageProxy().binding;
    let workOrderObject = sectionedTableProxy.binding;
    let funcLocNavLink = '';

    //First, check if FuncLoc_Nav link exists. If so, use it.
    funcLocNavLink = workOrderObject.FuncLoc_Nav;
    if (!ValidationLibrary.evalIsEmpty(funcLocNavLink)) {
        return workOrderObject['@odata.readLink'] + '/FuncLoc_Nav';
    }

    //Next, check if Equipment_Nav link exists. If so, use it to get the FLOC nav-link.
    if (!ValidationLibrary.evalIsEmpty(workOrderObject.Equipment_Nav)) {
        funcLocNavLink = workOrderObject.Equipment_Nav.FunctionalLocation;
        if (!ValidationLibrary.evalIsEmpty(funcLocNavLink)) {
            return workOrderObject.Equipment_Nav['@odata.readLink'] + '/FunctionalLocation';
        }
    }

    //Next, check if NotifHeader_Nav link exists. If so, use its FLOC link. Otherwise, use that notification's equipment and then get that equipment's FLOC nav-link.
    if (!ValidationLibrary.evalIsEmpty(workOrderObject.NotifHeader_Nav)) {            
        funcLocNavLink = workOrderObject.NotifHeader_Nav.FunctionalLocation;
        if (!ValidationLibrary.evalIsEmpty(funcLocNavLink)) {
            return workOrderObject.NotifHeader_Nav['@odata.readLink'] + '/FunctionalLocation';
        }

        let equipNavLink = workOrderObject.NotifHeader_Nav.Equipment;
        if (!ValidationLibrary.evalIsEmpty(equipNavLink)) {
            funcLocNavLink = equipNavLink.FunctionalLocation;
            if (!ValidationLibrary.evalIsEmpty(funcLocNavLink)) {
                return equipNavLink['@odata.readLink'] + '/FunctionalLocation';
            }
        }
    }

    //We can't find the FLOC nav-link from the code above so return a blank.
    return workOrderObject['@odata.readLink'];
}
