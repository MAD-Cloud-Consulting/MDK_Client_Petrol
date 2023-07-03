import isSupervisorSectionVisibleForOperations from '../../Supervisor/SupervisorRole/IsSupervisorSectionVisibleForOperations';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function IsUnAssignEnableWorkOrderOperation(context) {
    return isSupervisorSectionVisibleForOperations(context).then(function(visible) {
        if (visible) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], ['PersonNum','Employee_Nav/FirstName'], '$expand=Employee_Nav').then(function(results) {
                if (results && results.length > 0) {
                    let row = results.getItem(0);
                    if (row.Employee_Nav && row.PersonNum && row.PersonNum !== '00000000' && row['@sap.isLocal']) {
                        return true;
                    }
                }
                return false;
            });
        }
        return false;
    });
}
