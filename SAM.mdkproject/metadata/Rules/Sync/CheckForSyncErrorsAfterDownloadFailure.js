import InitDefaultOverviewRows from '../Confirmations/Init/InitDefaultOverviewRows';
import setSyncInProgressState from './SetSyncInProgressState';
export default function CheckForSyncErrorsAfterDownloadFailure(context) {
    setSyncInProgressState(context, false);
    return InitDefaultOverviewRows(context).then(() => {
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'ErrorArchive', '').then(result => {
            if (result > 0) {
                context.executeAction('/SAPAssetManager/Actions/OData/ODataUploadFailureMessage.action');
            } else {
                context.executeAction('/SAPAssetManager/Actions/OData/ODataDownloadFailureMessage.action');
            }
        });
    });
}
