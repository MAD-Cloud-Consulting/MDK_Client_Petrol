export default function EquipmentBOMItemsQueryOptions(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'EquipmentBOMs', [], `$expand=BOMHeader_Nav&$filter=EquipId eq '${context.binding.binding.EquipId}'`).then(function(results) {
        if (results.length > 0) {
            return `$filter=BOMId eq '${results.getItem(0).BOMHeader_Nav.BOMId}' and BOMCategory eq '${results.getItem(0).BOMHeader_Nav.BOMCategory}'&$orderby=ItemId`;
        }
        return '';
    });
}
