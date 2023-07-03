import libSuper from '../SupervisorLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';

/**
 * Displays the Supervisor section containing pending Work Orders for review when the user is in the Supervisor Role.
 * @param {*} context 
 */
export default function IsSupervisorSectionVisibleForWO(context) {
    if ((libSuper.isSupervisorFeatureEnabled(context)) && (libMobile.isHeaderStatusChangeable(context))) {
        return libSuper.isUserSupervisor(context).then(isSupervisor => {
            if (isSupervisor) {
                return true;
            }
            return false;
        });
    } else {
        return Promise.resolve(false);
    }
}


