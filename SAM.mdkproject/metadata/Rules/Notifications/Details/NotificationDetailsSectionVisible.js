import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import IsServiceNotification from '../Service/IsServiceNotification';

/**
 * Checks if the notification detail scection should be shown or not.
 * @param {*} context 
 * @returns true if phase model is not enabled and is not a service order.
 */
export default function NotificationDetailsSectionVisible(context) {
    if (!IsPhaseModelEnabled(context)) {
        return IsServiceNotification(context).then(isServiceNotif => {
            return !isServiceNotif;
        });    
    }
    return false;
}
