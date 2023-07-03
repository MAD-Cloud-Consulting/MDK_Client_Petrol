export default function SetMaterialDocumentListRecentTitle(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocuments', '$filter=sap.islocal()&$orderby=MaterialDocNumber').then(function(result) {
        context.setCaption(context.localizeText('overview_recent') +' (' + result.toString() + ')');
        // eslint-disable-next-line no-unused-vars
    }).catch(function(err) {
        //TODO: Log error
        context.setCaption(context.localizeText('overview_recent'));
    });
}
