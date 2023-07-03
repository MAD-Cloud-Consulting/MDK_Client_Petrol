import EnableNotificationCreate from './EnableNotificationCreate';
import EnableWorkOrderEdit from '../WorkOrders/EnableWorkOrderEdit';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';

export default function EnableNotificationCreateFromWorkOrder(clientAPI) {

    if (!IsPhaseModelEnabled(clientAPI)) {
        if (EnableNotificationCreate(clientAPI)) {
            return EnableWorkOrderEdit(clientAPI).then(isEditEnabled => {
                return isEditEnabled;
            });
        }
    }

    return Promise.resolve(false);
}
