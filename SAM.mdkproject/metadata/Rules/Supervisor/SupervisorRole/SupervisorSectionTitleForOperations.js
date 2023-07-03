import libSuper from '../SupervisorLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';

/**
 * Title of the Supervisor section for Operations.
 * @param {*} context 
 */
export default function supervisorSectionTitleForOperations(context) {
    if (libMobile.isOperationStatusChangeable(context)) {
        return libSuper.isUserSupervisor(context).then(isSupervisor => {
            if (isSupervisor) { 
                return libSuper.supervisorSectionTitleForPendingOperationReviews(context);
            }
            return '';
        });
    } else {
        return '';
    } 
}


