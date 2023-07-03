import applicationOnSync from '../ApplicationEvents/ApplicationOnSync';

export default function SyncFromSyncError(context) {
    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
        return applicationOnSync(context);
    });
}
