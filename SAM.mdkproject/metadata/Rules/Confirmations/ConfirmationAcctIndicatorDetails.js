

export default function ConfirmationAcctIndicatorDetails(context) {
    let acctIndicatorId = context.getBindingObject().AccountingIndicator;

    if (acctIndicatorId.length === 0) {
        return '-';
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'AcctIndicators', [], `$filter=AcctIndicator eq '${acctIndicatorId}'&$top=1`).then(result => {
        if (!result || result.length === 0) {
            return '-';
        }
        let acctIndicator = result.getItem(0);
        return acctIndicator.AcctIndicator + (acctIndicator.AcctIndicatorDesc.length > 0 ? ' - ' + acctIndicator.AcctIndicatorDesc : '');
    });
}
