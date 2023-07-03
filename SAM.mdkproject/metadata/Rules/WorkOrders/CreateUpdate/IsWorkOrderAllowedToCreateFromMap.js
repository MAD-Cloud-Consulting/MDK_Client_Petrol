import IsWorkOrderAllowedToCreateUpdate from './IsWorkOrderAllowedToCreateUpdate';
import IsSupervisorSectionVisibleForWO from '../../Supervisor/SupervisorRole/IsSupervisorSectionVisibleForWO';
import EnableWorkOrderCreate from '../../UserAuthorizations/WorkOrders/EnableWorkOrderCreate';

export default function IsWorkOrderAllowedToCreateFromMap(context) {
    if (IsWorkOrderAllowedToCreateUpdate(context)) {
        return true;
    }
    return IsSupervisorSectionVisibleForWO(context).then(result => {
        if (result) {
            return EnableWorkOrderCreate(context);
        }
        return false;
    });
}
