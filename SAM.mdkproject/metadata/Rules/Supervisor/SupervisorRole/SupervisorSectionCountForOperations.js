import libSuper from '../SupervisorLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';

/**
 * Operations count to be displayed on the overview page for Supervisor Role.
 * @param {*} context 
 */
export default function supervisorSectionCountForOperations(context) {
    if (libMobile.isOperationStatusChangeable(context)) {
        return libSuper.isUserSupervisor(context).then(isSupervisor => {
            if (isSupervisor) { 
                return libSuper.pendingOperationsReviewCount(context);
            }
            return '';
        });
    } else {
        return '';
    } 
 }

  
