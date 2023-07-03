/**
* Show/Hide Work Order create button based on User Authorization
* @param {IClientAPI} context
*/
import isSupervisorSectionVisibleForWO from './IsSupervisorSectionVisibleForWO';
import enableWorkOrderCreate from '../../UserAuthorizations/WorkOrders/EnableWorkOrderCreate';

export default function IsSupervisorEnableWorkOrderCreate(context) {
    return isSupervisorSectionVisibleForWO(context).then(function(visible) {
        if (visible) {
            return false;
        }
        return enableWorkOrderCreate(context);
    });
}
