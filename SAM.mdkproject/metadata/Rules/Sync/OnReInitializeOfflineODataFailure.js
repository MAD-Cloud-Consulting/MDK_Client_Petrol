import setSyncInProgressState from './SetSyncInProgressState';
export default function OnReInitializeOfflineODataFailure(context) {
    setSyncInProgressState(context, false);
    return context.executeAction('/SAPAssetManager/Actions/OData/InitializeOfflineODataCreateFailureMessage.action');
}
