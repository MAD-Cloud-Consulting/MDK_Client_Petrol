export default function EquipmentBOMItemsOnlineQueryOptions(context) {
    return context.executeAction('/SAPAssetManager/Actions/OData/OpenOnlineService.action').then(function() {
        return context.read('/SAPAssetManager/Services/OnlineAssetManager.service', 'EquipmentBOMs', [], `$expand=BOMHeader_Nav&$filter=EquipId eq '${context.binding.binding.EquipId}'`).then(function(results) {
            if (results.length > 0) {
                return `$filter=BOMId%20eq%20'${results.getItem(0).BOMHeader_Nav.BOMId}'%20and%20BOMCategory%20eq%20'${results.getItem(0).BOMHeader_Nav.BOMCategory}'`;
            }
            return '';
        });
    });
}
