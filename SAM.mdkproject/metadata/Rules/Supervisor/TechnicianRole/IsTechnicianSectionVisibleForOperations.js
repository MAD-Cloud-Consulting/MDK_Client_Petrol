import libSuper from '../SupervisorLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';

/**
 * Displays the Technician section containing submitted Operations when the user is in the Technician Role.
 * @param {*} context 
 */
export default function isTechnicianSectionVisibleForOperations(context) {
    if ((libSuper.isSupervisorFeatureEnabled(context)) && (libMobile.isOperationStatusChangeable(context))) {
    return libSuper.isUserTechnician(context).then(isTechnician => {
        if (isTechnician) {
            return true;
        }
        return false;
    });
    } else {
        return false;
    } 
}

