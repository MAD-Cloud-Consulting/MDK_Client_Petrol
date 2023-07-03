import libSuper from '../SupervisorLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';

/**
 * Work Order count to be displayed on the overview page for Technician Role.
 * @param {*} context 
 */
export default function technicianSectionCountForWO(context) {
    if (libMobile.isHeaderStatusChangeable(context)) {
        return libSuper.isUserTechnician(context).then(isTechnician => {
            if (isTechnician) { 
                return libSuper.submittedWOCount(context);
            }
            return '';
        });
    } else {
        return '';
    } 
}
