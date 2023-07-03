import libSuper from '../SupervisorLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';

/**
 * Displays the empty Supervisor section title when there are no submitted operations for the Supervisor Role.
 * @param {*} context 
 */
export default function supervisorEmptySectionTitleForOperations(context) {
    if ((libSuper.isSupervisorFeatureEnabled(context)) && (libMobile.isOperationStatusChangeable(context))) {
    return libSuper.isUserSupervisor(context).then(isSupervisor => {
        if (isSupervisor) {
            return libSuper.supervisorSectionTitleforNoOperations(context);
        }
        return '';
    });
    } else {
        return '';
    }  
}

