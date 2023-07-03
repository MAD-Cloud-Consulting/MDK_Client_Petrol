import ValidationLibrary from '../Common/Library/ValidationLibrary';

/**
 * Returns the description of the notification for this work order object.
 * If there is no notification nav-link for this work order object, then the notification number is returned, not the description.
 * A work order object does not need to have a notification number. In that case, the workOrderObject.NotifNum would be blank and a dash is returned.
 *
 * @param {*} sectionedTableProxy 
 */
export default function WorkOrderObjectNotificationDesc(sectionedTableProxy) {
    //let workOrder = sectionedTableProxy.getPageProxy().binding;
    let workOrderObject = sectionedTableProxy.binding;    
    if (!ValidationLibrary.evalIsEmpty(workOrderObject.NotifHeader_Nav)) {            
        let notifDesc = workOrderObject.NotifHeader_Nav.NotificationDescription;
        if (!ValidationLibrary.evalIsEmpty(notifDesc)) {
            return notifDesc;
        }
    }
    if (!ValidationLibrary.evalIsEmpty(workOrderObject.NotifNum)) {
        return workOrderObject.NotifNum;
    } else {
        return '-';
    }
}
