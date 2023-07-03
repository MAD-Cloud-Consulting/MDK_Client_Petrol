import libSuper from '../SupervisorLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';

/**
 * Title of the Technician section for Operations.
 * @param {*} context 
 */
export default function technicianSectionTitleForOperations(context) {
    if (libMobile.isOperationStatusChangeable(context)) {
        return libSuper.isUserTechnician(context).then(isTechnician => {
            if (isTechnician) { 
                return libSuper.technicianSectionTitleforOperations(context);
            }
            return '';
        });
    } else {
        return '';
    } 
}

