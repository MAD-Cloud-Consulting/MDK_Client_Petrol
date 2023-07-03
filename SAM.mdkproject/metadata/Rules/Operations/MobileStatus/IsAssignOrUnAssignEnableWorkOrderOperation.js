import isSupervisorSectionVisibleForOperations from '../../Supervisor/SupervisorRole/IsSupervisorSectionVisibleForOperations';
import libVal from '../../Common/Library/ValidationLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function IsAssignOrUnAssignEnableWorkOrderOperation(context) {
    return isSupervisorSectionVisibleForOperations(context).then(function(visible) {
        if (visible) {
            if (libVal.evalIsEmpty(context.binding.Employee_Nav) || (!(libVal.evalIsEmpty(context.binding.Employee_Nav)) && context.binding['@sap.isLocal'])) {
                return true;
            }
            return false;
        }
        return false;
    });
}
