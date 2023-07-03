import common from '../../Common/Library/CommonLibrary';
import IsEventPriorityMatrixEnabled from '../../Common/IsEventPriorityMatrixEnabled';

// Return true if and only if the record in question has been locally created
function isLocalOnly(binding) {
    return !!(binding['@sap.isLocal'] && !binding['@sap.isUpdated']);
}

/**
 * Sets initial Event Priority matrix button visibility
 * @param {IClientAPI} context
 * @returns {Promise<Boolean>} true if NotificationType and TechnicalObject exits on binding, and Plant exists (editing Notification). False if otherwise.
 */
export default function EMPButtonIsVisible(context) {
    if (IsEventPriorityMatrixEnabled(context)) {
        const STARTED = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        const ACTIONREQ = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ActionRequired.global').getValue());
        var mobileStatusAllowed = false;
        try {
            // Shorthand for allowed mobile statuses
            mobileStatusAllowed = context.binding.OverallStatus_Nav.MobileStatus === ACTIONREQ || context.binding.OverallStatus_Nav.MobileStatus === STARTED;
        } catch (error) {
            mobileStatusAllowed = true;
        }
        if (isLocalOnly(context.binding) || mobileStatusAllowed) {
            // Get plant based on Equipment then FuncLoc then Notification
            // Inline functions used to catch exceptions if Equipment/FLOC doesn't exist
            // eslint-disable-next-line brace-style
            let plant = (() => { try { return context.binding.Equipment.MaintPlant; } catch (exc) { return undefined; } })() || (() => { try { return context.binding.FunctionalLocation.MaintPlant; } catch (exc) { return undefined; } })() || '';
            return context.count('/SAPAssetManager/Services/AssetManager.service', 'ConsequenceCategories', `$filter=ConsequenceGroup_Nav/PrioritizationProfile_Nav/PrioritizationProfileLink_Nav/any(ppl:ppl/NotificationType eq '${context.binding.NotificationType}' and ppl/Plant eq '${plant}')`).then(count => {
                return !!plant && count > 0;
            });
        }
    }
    return Promise.resolve(false);

}
