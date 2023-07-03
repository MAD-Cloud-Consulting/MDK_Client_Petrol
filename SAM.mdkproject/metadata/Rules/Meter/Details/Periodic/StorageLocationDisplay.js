export default function StorageLocationDisplay(context) {
    if (context.getPageProxy().binding.Device_Nav.GoodsMovement_Nav && context.getPageProxy().binding.Device_Nav.GoodsMovement_Nav.length > 0) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `Locations(Plant='${context.getPageProxy().binding.Device_Nav.GoodsMovement_Nav[0].Plant}',Location='${context.getPageProxy().binding.Device_Nav.GoodsMovement_Nav[0].StorageLocation}')`, [], '').then(function(result) {
            let location;
            if (result && (location = result.getItem(0))) {
                return context.getPageProxy().binding.Device_Nav.GoodsMovement_Nav[0].StorageLocation + ' - ' + location.LocationName;
            } else {
                return '-';
            }
        });
    } else {
        return '-';
    }
}
