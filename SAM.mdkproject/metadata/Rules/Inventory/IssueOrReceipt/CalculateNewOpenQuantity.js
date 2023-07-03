import libCom from '../../Common/Library/CommonLibrary';

export default function CalculateNewOpenQuantity(context) {
    
    let type = libCom.getStateVariable(context, 'IMObjectType');
    const tempItem = libCom.getStateVariable(context, 'TempItem');

    const binding = context.binding.TempItem_OpenQuantity !== undefined && context.binding || tempItem;

    if (type === 'STO') {
        return Number(binding.TempItem_OpenQuantity); //Open is unused on client for STO
    }

    //Subtract new quantity from previously open adding old quantity (if this was an edit)
    return Number(binding.TempItem_OpenQuantity) - Number(binding.TempLine_EntryQuantity) + Number(binding.TempLine_OldQuantity);
    
}
