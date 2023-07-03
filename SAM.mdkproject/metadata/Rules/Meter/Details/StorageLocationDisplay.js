export default function StorageLocationDisplay(context) {
    let goodsMovement;

    if (context.getPageProxy().binding.Device_Nav) {
        goodsMovement = context.getPageProxy().binding.Device_Nav.GoodsMovement_Nav;
    } else {
        goodsMovement = context.getPageProxy().binding.GoodsMovement_Nav;
    }
    if (goodsMovement && goodsMovement[0]) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `Locations(Plant='${goodsMovement[0].Plant}',Location='${goodsMovement[0].StorageLocation}')`, [], '').then(function(result) {
            let location;
            if (result && (location = result.getItem(0))) {
                return goodsMovement[0].StorageLocation + ' - ' + location.LocationName;
            } else {
                return '-';
            }
        });
    } else {
        return '-';
    }
}
