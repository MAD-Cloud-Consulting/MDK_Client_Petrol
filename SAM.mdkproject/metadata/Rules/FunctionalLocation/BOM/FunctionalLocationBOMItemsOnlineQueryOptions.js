export default function FunctionalLocationBOMItemsOnlineQueryOptions(context) {
    return context.executeAction('/SAPAssetManager/Actions/OData/OpenOnlineService.action').then(function() {
        return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'FunctionalLocationBOMs', [], `$expand=BOMHeader_Nav&$filter=FuncLocIdIntern eq '${context.binding.binding.FuncLocIdIntern}'`).then(function(results) {
            if (results.length > 0) {
                return `$filter=BOMId%20eq%20'${results.getItem(0).BOMHeader_Nav.BOMId}'%20and%20BOMCategory%20eq%20'${results.getItem(0).BOMHeader_Nav.BOMCategory}'`;
            }
            return '';
        });
    });
}
