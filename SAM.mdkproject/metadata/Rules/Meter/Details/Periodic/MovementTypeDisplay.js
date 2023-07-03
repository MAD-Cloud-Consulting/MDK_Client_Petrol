export default function MovementTypeDisplay(context) {
    if (context.getPageProxy().binding.Device_Nav.GoodsMovement_Nav && context.getPageProxy().binding.Device_Nav.GoodsMovement_Nav.length > 0) {
        if (context.getPageProxy().binding.Device_Nav.GoodsMovement_Nav[0].MovementType) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `MovementTypeTcodes('${context.getPageProxy().binding.Device_Nav.GoodsMovement_Nav[0].MovementType}')`, [], '').then(function(result) {
                let movementDescr;
                if (result && (movementDescr = result.getItem(0))) {
                    return context.getPageProxy().binding.Device_Nav.GoodsMovement_Nav[0].MovementType + ' - ' + movementDescr.MovementTypeDescription;
                } else {
                    return '-';
                }
            });
        }
    } else {
        return '-';
    }
}
