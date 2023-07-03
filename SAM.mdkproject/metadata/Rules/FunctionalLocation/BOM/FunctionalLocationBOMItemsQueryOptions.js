export default function FunctionalLocationBOMItemsQueryOptions(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'FunctionalLocationBOMs', [], `$expand=BOMHeader_Nav&$filter=FuncLocIdIntern eq '${context.binding.binding.FuncLocIdIntern}'`).then(function(results) {
        if (results.length > 0) {
            return `$filter=BOMId eq '${results.getItem(0).BOMHeader_Nav.BOMId}' and BOMCategory eq '${results.getItem(0).BOMHeader_Nav.BOMCategory}'`;
        }
        return '';
    });
}
