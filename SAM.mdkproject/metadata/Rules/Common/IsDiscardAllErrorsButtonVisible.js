export default function IsDiscardAllErrorsButtonVisible(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'ErrorArchive', '').then(function(resultCount) {
        if (resultCount > 0) {
            return true;
        }
        return false;
    });
}
