export default function PlantValue(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `Plants('${context.binding.Plant}')`, [], '$select=PlantDescription').then(function(result) {
        return `${context.binding.StorageLocationDesc} - ${context.binding.StorageLocation} - ${result.getItem(0).PlantDescription}`;
    }).catch(function() {
        return `${context.binding.StorageLocationDesc} - ${context.binding.Plant}`;
    });
}
