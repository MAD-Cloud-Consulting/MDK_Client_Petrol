import isSupervisorSectionVisibleForWO from '../../Supervisor/SupervisorRole/IsSupervisorSectionVisibleForWO';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function IsAssignOrUnAssignEnableWorkOrder(context) {
    return isSupervisorSectionVisibleForWO(context).then(function(visible) {
        if (visible) {
            let partnerFunction = 'VW';
            return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/WOPartners', [], `$filter=PartnerFunction eq '${partnerFunction}'`).then(function(results) {
                if (results && results.length === 0) {
                    return true;
                } else if (results && results.length === 1 && results.getItem(0).hasOwnProperty('@sap.isLocal')) {
                    return true;
                }
                return false;
            });
        }
        return false;
    });
}
