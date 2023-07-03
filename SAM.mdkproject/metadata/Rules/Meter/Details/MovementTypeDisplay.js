export default function MovementTypeDisplay(context) {
    let goodsMovement = [];
    if (context.getPageProxy().binding.Device_Nav) {
        goodsMovement = context.getPageProxy().binding.Device_Nav.GoodsMovement_Nav;
    } else {
        goodsMovement = context.getPageProxy().binding.GoodsMovement_Nav;
    }
    if (goodsMovement && goodsMovement.length > 0) {
        if (goodsMovement[0].MovementType) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `MovementTypeTcodes('${goodsMovement[0].MovementType}')`, [], '').then(function(result) {
                let movementDescr;
                if (result && (movementDescr = result.getItem(0))) {
                    return goodsMovement[0].MovementType + ' - ' + movementDescr.MovementTypeDescription;
                } else {
                    return '-';
                }
            });
        }
    } else {
        return '-';
    }
}
