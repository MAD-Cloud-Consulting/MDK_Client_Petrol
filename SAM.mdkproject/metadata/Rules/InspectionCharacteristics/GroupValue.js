export default function GroupValue(context) {
    if (context.binding.QuantitativeFlag) {
        return context.formatNumber(context.binding.ResultValue, '');
    } else {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/InspectionCode_Nav`, [], '').then(result => {
            if (result && result.length > 0) {
                return result.getItem(0).CodeGroupDesc;
            }
            return '-';
        }).catch(() => {
            return '-';
        });
    }
}
