
export default function AmountValueWithUOM(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderHeaders('${context.binding.OrderID}')`, [], '').then(result => {
        if (result && result.length) {
            return context.formatCurrency(context.binding.ActualWork, result.getItem(0).OrderCurrency, '',  {'maximumFractionDigits': 1, 'useGrouping': true});
        }
        
        return context.binding.ActualWork;
    });
}
