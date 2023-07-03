export default function DeviceLocation(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `DeviceLocations('${context.binding.Device_Nav.DeviceLocation}')`, [], '').then(function(result) {
        if (result && result.length > 0)
            return result.getItem(0).Description;
        else
            return '-';
    });
}
