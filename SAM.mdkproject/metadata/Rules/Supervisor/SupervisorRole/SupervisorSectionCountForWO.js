import libSuper from '../SupervisorLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';

/**
 * Work Order count to be displayed on the overview page for Supervisor Role.
 * @param {*} context 
 */
export default function supervisorSectionCountForWO(context) {
   if (libMobile.isHeaderStatusChangeable(context)) {
       return libSuper.isUserSupervisor(context).then(isSupervisor => {
           if (isSupervisor) { 
               return libSuper.pendingWOReviewCount(context);
           }
           return '';
       });
    } else {
        return '';
    } 
}


