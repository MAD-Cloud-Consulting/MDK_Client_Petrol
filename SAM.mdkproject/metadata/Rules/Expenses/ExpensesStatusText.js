export default function ExpensesStatusText(context) {
    const orderId = context.binding.OrderID;
    const price = context.binding.ActualWork;
    
    return context.read('/SAPAssetManager/Services/AssetManager.service','MyWorkOrderHeaders', [], `$filter=OrderId eq '${orderId}'`).then(wos => {
        return context.formatCurrency(price, wos.getItem(0).OrderCurrency, '',  {'maximumFractionDigits': 1, 'useGrouping': true});
    });
}
