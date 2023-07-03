export default function MeterStatusText(context) {
    let curReadLink = '/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav';
    if (context.getPageProxy().binding.Device_Nav) {
        curReadLink = context.getPageProxy().binding['@odata.readLink'] + '/Device_Nav' + curReadLink;
    } else {
        curReadLink = context.getPageProxy().binding['@odata.readLink'] + curReadLink;
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', curReadLink, [], '').then(result => {
        if (result && result.length > 0) {
            return result.getItem(0).StatusText;
        }
        return '';
    });
}
