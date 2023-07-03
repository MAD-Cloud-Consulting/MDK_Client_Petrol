export default function MeterStatusText(context) {
    let curReadLink = context.getPageProxy().binding['@odata.readLink'] + '/Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav';
    return context.read('/SAPAssetManager/Services/AssetManager.service', curReadLink, [], '').then(result => {
        if (result && result.length > 0) {
            return result.getItem(0).StatusText;
        }
        return '';
    });
}
