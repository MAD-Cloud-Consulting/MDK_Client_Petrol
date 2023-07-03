export default function DiscardErrorsAction(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'ErrorArchive', [] ,'').then(function(results) {
        if (results && results.length > 0) {
            return context.getPageProxy().executeAction('/SAPAssetManager/Actions/Common/ErrorArchiveDiscardNoClosePage.action').then( ()=> {
                return DiscardErrorsAction(context);
            });
        }
        return context.getPageProxy().executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
    });
}
