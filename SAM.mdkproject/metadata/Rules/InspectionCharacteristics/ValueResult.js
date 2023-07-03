export default function ValueResult(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/InspectionCode_Nav`, [], '').then(result => {
        if (result && result.length > 0) {
            return result.getItem(0).CodeDesc;
        } else {
            return context.formatNumber(context.binding.MeanValue, '');
        }
    });
}
