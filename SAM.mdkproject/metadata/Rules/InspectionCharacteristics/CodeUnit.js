export default function CodeUnit(context) {
    if (context.binding.QuantitativeFlag) {
        return context.binding.SampleUOM;
    } else {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/InspectionCode_Nav`, [], '').then(result => {
            if (result && result.length > 0) {
                return result.getItem(0).CodeDesc;
            }
            return '-';
        }).catch(() => {
            return '-';
        });
    }
}
