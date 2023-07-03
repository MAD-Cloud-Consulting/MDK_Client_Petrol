export default function ConfirmationsCount(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'ConfirmationOverviewRows', [], '$orderby=PostingDate desc&$top=14').then(result => {
        if (result && result.length > 0) {
            return result.length;
        } else {
            return 0;
        }
    }).catch(() => {
       return 0;
    });
}
