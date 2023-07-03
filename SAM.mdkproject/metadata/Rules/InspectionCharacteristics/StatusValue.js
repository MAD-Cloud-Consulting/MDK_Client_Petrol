export default function StatusValue(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/InspCharStatus_Nav`, [], '').then(result => {
        if (result && result.length > 0) {
            return result.getItem(0).ShortDesc;
        } else {
            return '-';
        }
    }).catch(() => {
        return '-';
    });
}
