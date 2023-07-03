import isSupervisorSectionVisibleForOperations from '../../Supervisor/SupervisorRole/IsSupervisorSectionVisibleForOperations';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function IsAssignEnableWorkOrderOperation(context) {
    return isSupervisorSectionVisibleForOperations(context).then(function(visible) {
        if (visible) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/Employee_Nav', ['FirstName'], '').then(function(results) {
                if (results && results.length > 0) {
                    return false;
                }
                return true;
            });
        }
        return false;
    });
}
