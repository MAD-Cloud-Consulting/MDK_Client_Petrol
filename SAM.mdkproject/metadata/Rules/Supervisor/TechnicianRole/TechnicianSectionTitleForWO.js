import libSuper from '../SupervisorLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';

/**
 * Title of the Technician section for Work Orders.
 * @param {*} context 
 */
export default function technicianSectionTitleForWO(context) {
    if (libMobile.isHeaderStatusChangeable(context)) {
        return libSuper.isUserTechnician(context).then(isTechnician => {
            if (isTechnician) { 
                return libSuper.technicianSectionTitleforWorkOrders(context);
            }
            return '';
        });
    } else {
        return '';
    } 
}

