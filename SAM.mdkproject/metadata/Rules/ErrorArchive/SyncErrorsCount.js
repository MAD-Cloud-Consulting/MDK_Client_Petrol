export default function SyncErrorsCount(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'ErrorArchive', '').then(errorCount => {
        if (errorCount > 0) {
            return errorCount;
        } else {
            return '';
        }
    }).catch(() => {
       return Promise.resolve();
    });
}
