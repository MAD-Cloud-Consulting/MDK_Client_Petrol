import libSuper from '../SupervisorLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';

/**
 * Operations count to be displayed on the overview page for Technician Role.
 * @param {*} context 
 */
export default function technicianSectionCountForOperations(context) {
    if (libMobile.isOperationStatusChangeable(context)) {
        return libSuper.isUserTechnician(context).then(isTechnician => {
            if (isTechnician) { 
                return libSuper.submittedOperationCount(context);
            }
            return '';
        });
    } else {
        return '';
    } 
}

