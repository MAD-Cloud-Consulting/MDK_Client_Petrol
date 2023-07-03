export default function ValuationShortText(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `InspectionResultValuations('${context.binding.Valuation}')`, [], '').then(result => {
        if (result && result.length > 0) {
            return result.getItem(0).ShortText;
        } else {
            return '-';
        }
    }).catch(() => {
        return '-';
    });
}
