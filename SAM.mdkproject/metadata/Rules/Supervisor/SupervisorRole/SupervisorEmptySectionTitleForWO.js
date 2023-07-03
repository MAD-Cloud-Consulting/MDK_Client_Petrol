import libSuper from '../SupervisorLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';

/**
 * Displays the empty Supervisor section title when there are no submitted work orders for the Supervisor Role.
 * @param {*} context 
 */
export default function supervisorEmptySectionTitleForWO(context) {
    if ((libSuper.isSupervisorFeatureEnabled(context)) && (libMobile.isHeaderStatusChangeable(context))) {
    return libSuper.isUserSupervisor(context).then(isSupervisor => {
        if (isSupervisor) {
            return libSuper.supervisorSectionTitleforNoWO(context);
        }
        return '';
    });
    } else {
        return '';
    }   
}

