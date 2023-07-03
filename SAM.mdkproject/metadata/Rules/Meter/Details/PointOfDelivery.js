export default function PointOfDelivery(context) {
    let installation = '';

    if (context.getPageProxy().binding.Device_Nav) {
        installation = context.getPageProxy().binding.Device_Nav.Installation;
    } else {
        installation = context.getPageProxy().binding.Installation;
    }
    if (installation) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `Installations('${installation}')`, [], '').then(function(result) {
            let pointOfDelivery;
            if (result && (pointOfDelivery = result.getItem(0))) {
                return pointOfDelivery.PointOfDeliveryId;
            } else {
                return '-';
            }
        });
    } else {
        return '-';
    }
}
