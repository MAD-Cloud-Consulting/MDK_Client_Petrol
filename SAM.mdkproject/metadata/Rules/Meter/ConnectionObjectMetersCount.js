export default function ConnectionObjectMetersCount(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', context.getPageProxy().binding['@odata.readLink'] + '/Devices_Nav', '');
}
