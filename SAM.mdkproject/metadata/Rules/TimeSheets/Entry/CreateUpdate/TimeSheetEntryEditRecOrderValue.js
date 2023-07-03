
export default function TimeSheetEntryEditRecOrderValue(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/MyWOHeader', [], '').then(function(results) {
        if (results && results.length > 0) {
            return results.getItem(0)['@odata.readLink'];
        }
        return '';
    });
}
