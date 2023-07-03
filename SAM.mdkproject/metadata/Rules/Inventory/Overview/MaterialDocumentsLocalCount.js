export default function MaterialDocumentsLocalCount(context) {
    let filter = '$filter=sap.islocal()&$orderby=MaterialDocNumber';

    return context.count('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocuments', filter).then(function(MaterialDocsAllLocalCount) {
            return MaterialDocsAllLocalCount;
    });
}
