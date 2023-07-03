
export default function LAMMeasurementDocTableKey(context) {
    
    let readLink = context.binding['@odata.readLink'];

    return context.read('/SAPAssetManager/Services/AssetManager.service', readLink + '/MeasurementDocs', [], '$orderby=ReadingTimestamp desc&$top=1').then(function(results) {
        if (results && results.length > 0) {
            let document = results.getItem(0);
            return document['@odata.readLink'];
        } else {
            return '';
        }
    });
}
