export default function ReceivingPlantDisplay(context) {
    if (context.getPageProxy().binding.Device_Nav.GoodsMovement_Nav && context.getPageProxy().binding.Device_Nav.GoodsMovement_Nav[0]) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `Locations(Plant='${context.getPageProxy().binding.Device_Nav.GoodsMovement_Nav[0].Plant}',Location='${context.getPageProxy().binding.Device_Nav.GoodsMovement_Nav[0].StorageLocation}')`, [], '$expand=Plant_Nav').then(function(result) {
            let location;
            if (result && (location = result.getItem(0))) {
                if (location && location.Plant_Nav) {
                    return location.Plant_Nav.Plant + ' - ' + location.Plant_Nav.PlantDescription;
                } else {
                    return '-';
                }
            } else {
                return '-';
            }
        });
    } else {
        return '-';
    }
}
