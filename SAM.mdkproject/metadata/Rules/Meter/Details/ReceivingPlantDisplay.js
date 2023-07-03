export default function ReceivingPlantDisplay(context) {
    let goodsMovement;

    if (context.getPageProxy().Device_Nav) {
        goodsMovement = context.getPageProxy().binding.Device_Nav.GoodsMovement_Nav;
    } else {
        goodsMovement = context.getPageProxy().binding.GoodsMovement_Nav;
    }
    if (goodsMovement && goodsMovement[0]) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `Locations(Plant='${goodsMovement[0].Plant}',Location='${goodsMovement[0].StorageLocation}')`, [], '$expand=Plant_Nav').then(function(result) {
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
