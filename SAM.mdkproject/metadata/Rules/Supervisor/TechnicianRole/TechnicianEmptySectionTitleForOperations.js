import libSuper from '../SupervisorLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';

/**
 * Displays the empty Technician section title when there are no submitted operations for the Technician Role.
 * @param {*} context 
 */
export default function technicianEmptySectionTitleForOperations(context) {
    if (libMobile.isOperationStatusChangeable(context)) {
        return libSuper.isUserTechnician(context).then(isTechnician => {
            if (isTechnician) { 
                return libSuper.technicianSectionTitleforNoOperations(context);
            }
            return '';
        });
    } else {
        return '';
    } 
}


