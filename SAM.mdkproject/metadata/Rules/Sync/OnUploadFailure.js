import InitDefaultOverviewRows from '../Confirmations/Init/InitDefaultOverviewRows';
import setSyncInProgressState from './SetSyncInProgressState';
export default function OnUploadFailure(context) {
    setSyncInProgressState(context, false);
    return InitDefaultOverviewRows(context).then(() => {
        return context.executeAction('/SAPAssetManager/Actions/OData/ODataUploadFailureMessage.action');
    });
}
