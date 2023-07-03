import libSuper from '../SupervisorLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';

/**
 * Displays the empty Technician section title when there are no submitted work orders for the Technician Role.
 * @param {*} context 
 */
export default function technicianEmptySectionTitleForWO(context) {
    if (libMobile.isHeaderStatusChangeable(context)) {
        return libSuper.isUserTechnician(context).then(isTechnician => {
            if (isTechnician) { 
                return libSuper.technicianSectionTitleforNoWorkOrders(context);
            }
            return '';
        });
    } else {
        return '';
    } 
}


