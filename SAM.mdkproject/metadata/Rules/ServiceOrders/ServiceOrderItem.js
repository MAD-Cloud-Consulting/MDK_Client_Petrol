import libVal from '../Common/Library/ValidationLibrary';

export default function ServiceOrderItem(context) {
    
    if (!libVal.evalIsEmpty(context.binding.ContractItemNum)) {
        return context.binding.ContractItemNum;
    }
    return '-';
}
    
