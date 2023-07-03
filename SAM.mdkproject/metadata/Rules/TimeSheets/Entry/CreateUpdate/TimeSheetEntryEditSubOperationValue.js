  
export default function TimeSheetEntryEditSubOperationValue(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/MyWOSubOperation', [], '').then(function(results) {
        let target = context.getTargetSpecifier();
        target.setDisplayValue('{{#Property:SubOperationNo}} - {{#Property:OperationShortText}}');
        target.setReturnValue('{@odata.readLink}');
        target.setEntitySet('MyWorkOrderSubOperations');
        target.setService('/SAPAssetManager/Services/AssetManager.service');
        target.setQueryOptions("$filter=OrderId eq '{{#Property:RecOrder}}' and OperationNo eq '{{#Property:Operation}}'&$orderby=SubOperationNo asc");
        context.setTargetSpecifier(target);
        if (results && results.length > 0) {
            return results.getItem(0)['@odata.readLink'];
        }
        return '';
    });
}
