import libVal from '../Common/Library/ValidationLibrary';

export default function ServiceOrderServiceProduct(context) {
    if (!libVal.evalIsEmpty(context.binding.ServiceProduct)) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `MyWorkOrderSales('${context.binding.OrderId}')`, [], '').then(function(result) {
            if (result && result.getItem(0)) {
                return `${context.binding.ServiceProduct} - ${result.getItem(0).ProductDesc}`;
            } else {
                return '-';
            }
        });
    }
    return '-';
}
