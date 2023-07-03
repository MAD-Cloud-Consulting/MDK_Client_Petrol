/**
* Show/Hide Work Order edit button based on User Authorization
* @param {IClientAPI} context
*/
import enableWorkOrderEdit from '../../UserAuthorizations/WorkOrders/EnableWorkOrderEdit';
import isSupervisorSectionVisibleForOperations from './IsSupervisorSectionVisibleForOperations';
import phaseModelEnabled from '../../Common/IsPhaseModelEnabled';

export default function IsSupervisorEnableWorkOrderEdit(context) {
    return isSupervisorSectionVisibleForOperations(context).then(function(visible) {
        if (visible || phaseModelEnabled(context)) {
            return false;
        }
        return enableWorkOrderEdit(context);
    });
}
