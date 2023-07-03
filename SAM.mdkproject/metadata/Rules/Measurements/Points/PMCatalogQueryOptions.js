export default function PMCatalogQueryOptions(pageClientAPI) {
    let binding = pageClientAPI.binding;
    if (binding['@odata.type'] === pageClientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderTool.global').getValue()) {
        binding = binding.PRTPoint;
    } 
    return `$filter=CodeGroup eq '${binding.CodeGroup}' and Catalog eq '${binding.CatalogType}'&$orderby=Code`;
}
