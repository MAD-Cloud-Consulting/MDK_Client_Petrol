import ValidationLibrary from '../Common/Library/ValidationLibrary';

/**
 * Returns the description of the functional location for the work order object.
 * If there is no functional location nav-link for this work order object, then the equipment is checked next. If the equipment has a FLOC then it's desc is used.
 * If the equipment does not have a FLOC, then the notification is checked for a FLOC. If that does not exist, then the notification's equipment is checked for the FLOC.
 * A work order object does not need to have a FLOC. In that case, a dash is returned.
 *
 * @param {*} sectionedTableProxy 
 */
export default function WorkOrderObjectFuncLocDesc(sectionedTableProxy) {

    //let workOrder = sectionedTableProxy.getPageProxy().binding;
    let workOrderObject = sectionedTableProxy.binding;
    let funcLocNavLink = '';
    let funcLocDesc = '';
    let funcLocId = workOrderObject.FuncLocIdIntern;

    //First, check if FuncLoc_Nav link exists. If so, use it.
    if (!ValidationLibrary.evalIsEmpty(workOrderObject.FuncLoc_Nav)) {
        funcLocDesc = workOrderObject.FuncLoc_Nav.FuncLocDesc;
        if (!ValidationLibrary.evalIsEmpty(funcLocDesc)) {
            return funcLocDesc;
        }
    }

    //Next, check if Equipment_Nav link exists. If so, use it to get the FLOC.
    if (!ValidationLibrary.evalIsEmpty(workOrderObject.Equipment_Nav)) {
        funcLocNavLink = workOrderObject.Equipment_Nav.FunctionalLocation;
        funcLocId = workOrderObject.Equipment_Nav.FuncLocIdIntern;
        if (!ValidationLibrary.evalIsEmpty(funcLocNavLink)) {
            funcLocDesc = funcLocNavLink.FuncLocDesc;
            if (!ValidationLibrary.evalIsEmpty(funcLocDesc)) {
                return funcLocDesc;
            }
        }
    }

    //Next, check if NotifHeader_Nav link exists. If so, use its FLOC. Otherwise, use that notification's equipment and then get that equipment's FLOC.
    if (!ValidationLibrary.evalIsEmpty(workOrderObject.NotifHeader_Nav)) {            
        funcLocNavLink = workOrderObject.NotifHeader_Nav.FunctionalLocation;
        funcLocId = workOrderObject.NotifHeader_Nav.HeaderFunctionLocation;
        if (!ValidationLibrary.evalIsEmpty(funcLocNavLink)) {
            funcLocDesc = funcLocNavLink.FuncLocDesc;
            if (!ValidationLibrary.evalIsEmpty(funcLocDesc)) {
                return funcLocDesc;
            }
        }

        let equipNavLink = workOrderObject.NotifHeader_Nav.Equipment;
        if (!ValidationLibrary.evalIsEmpty(equipNavLink)) {
            funcLocNavLink = equipNavLink.FunctionalLocation;
            funcLocId = equipNavLink.FuncLocIdIntern;
            if (!ValidationLibrary.evalIsEmpty(funcLocNavLink)) {
                funcLocDesc = funcLocNavLink.FuncLocDesc;
                if (!ValidationLibrary.evalIsEmpty(funcLocDesc)) {
                    return funcLocDesc;
                }
            }
        }
        
    }

    //We can't find the FLOC description from the code above so return the FLOC id if it exists.
    if (!ValidationLibrary.evalIsEmpty(funcLocId)) {
        return funcLocId;
    } else {
        return '-';
    }
}
