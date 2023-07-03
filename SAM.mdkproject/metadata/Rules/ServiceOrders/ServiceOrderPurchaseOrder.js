import libVal from '../Common/Library/ValidationLibrary';

export default function ServiceOrderPurchaseOrder(context) {
    
    if (!libVal.evalIsEmpty(context.binding.CustomerReference)) {
        return context.binding.CustomerReference;
    }
    return '-';
    
}
