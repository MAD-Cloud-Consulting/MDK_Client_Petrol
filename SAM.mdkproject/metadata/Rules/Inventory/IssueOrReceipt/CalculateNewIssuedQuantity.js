import libCom from '../../Common/Library/CommonLibrary';

export default function CalculateNewIssuedQuantity(context) {
    
    //When updating the local inventory item, add new quantity minus the old quantity (if this is an edit) to existing issued quantity
    let type = libCom.getStateVariable(context, 'IMObjectType');
    let move = libCom.getStateVariable(context, 'IMMovementType');
    const tempItem = libCom.getStateVariable(context, 'TempItem');

    const binding = context.binding.TempItem_IssuedQuantity !== undefined && context.binding || tempItem;
    if (type === 'STO') {
        if (move === 'I') {
            return Number(binding.TempItem_IssuedQuantity) + Number(binding.TempLine_EntryQuantity) - Number(binding.TempLine_OldQuantity);
        }
        return Number(binding.TempItem_IssuedQuantity); //This is a receipt, so do not change the number

    }
    return Promise.resolve(true); //No update necessary
 
}
