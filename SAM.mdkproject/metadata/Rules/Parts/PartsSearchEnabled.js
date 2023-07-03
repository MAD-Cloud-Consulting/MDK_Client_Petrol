export default function PartsSearchEnabled(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', `${context.getPageProxy().binding['@odata.readLink']}/Components`, '').then(count => {
        return count !== 0;
    });
}
