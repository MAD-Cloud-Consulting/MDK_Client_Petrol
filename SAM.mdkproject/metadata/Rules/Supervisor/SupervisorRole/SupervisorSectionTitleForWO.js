import libSuper from '../SupervisorLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';

/**
 * Title of the Supervisor section for Work Orders.
 * @param {*} context 
 */
export default function supervisorSectionTitleForWO(context) {
    if (libMobile.isHeaderStatusChangeable(context)) {
        return libSuper.isUserSupervisor(context).then(isSupervisor => {
            if (isSupervisor) { 
                return libSuper.supervisorSectionTitleForPendingWOReviews(context);
            }
            return '';
        });
    } else {
        return '';
    } 
}


