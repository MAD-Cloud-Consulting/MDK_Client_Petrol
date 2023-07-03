export default function InspectionLotValuation(context) {
    let binding = context.getBindingObject();
    let status = binding.InspectionLot_Nav.ValuationStatus;

    return context.read('/SAPAssetManager/Services/AssetManager.service', `InspectionResultValuations('${status}')`, [], '').then(result => {
        if (result && result.length > 0) {
            return result.getItem(0).ShortText;
        }
        return '-';
    }).catch(() => {
        return '-';
    });
}
