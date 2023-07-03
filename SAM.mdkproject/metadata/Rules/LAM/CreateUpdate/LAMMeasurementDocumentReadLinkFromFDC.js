
export default function LAMMeasurementDocumentReadLinkFromFDC(pageProxy) {
    
    let binding = pageProxy.getActionBinding();

    let pointNum = binding.Point;

    return pageProxy.read('/SAPAssetManager/Services/AssetManager.service', `MeasuringPoints('${pointNum}')` + '/MeasurementDocs', [], '$filter=sap.islocal()&$orderby=ReadingTimestamp desc&$top=1').then(function(results) {
        if (results && results.length > 0) {
            let document = results.getItem(0);
            return document['@odata.readLink'];
        } else {
            return '';
        }
    });
}
