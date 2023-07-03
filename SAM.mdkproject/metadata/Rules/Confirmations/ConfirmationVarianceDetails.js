
export default function ConfirmationVarianceDetails(context) {
    let varianceId = context.getBindingObject().VarianceReason;
    if (varianceId.length === 0) {
        return '-';
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'VarianceReasons', [], `$filter=VarianceReason eq '${varianceId}'&$top=1`).then(result => {
        if (!result || result.length === 0) {
            return '-';
        }
        let variance = result.getItem(0);
        return variance.VarianceReason + (variance.ReasonText.length > 0 ? ' - ' + variance.ReasonText : '');
    });
}
