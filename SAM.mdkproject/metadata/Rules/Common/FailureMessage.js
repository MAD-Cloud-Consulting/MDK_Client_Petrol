import AutoSyncLibrary from '../ApplicationEvents/AutoSync/AutoSyncLibrary';

export default function FailureMessage(context, failureMessageString = 'update_failed', failureDueToAutoSyncMessageString = 'update_failed_due_to_autosync') {
    if (AutoSyncLibrary.isAutoSyncEnabledOnSave(context) && context.binding && context.binding['@odata.readLink']) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '')
            .then(() => {
                return context.localizeText(failureMessageString);
            })
            .catch(() => {
                return context.localizeText(failureDueToAutoSyncMessageString);
            });
    }
 
    return context.localizeText(failureMessageString);
}
