import libPart from '../../PartLibrary';

export default function PartReturnLineItemQuantity(pageClientAPI) {
    
    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    let returnQty = '';
    let serialNums = pageClientAPI.evaluateTargetPath('#Control:SerialNumLstPkr/#Value');

    if (serialNums.length > 0) {
        returnQty = serialNums.length.toString();
    } else {
        returnQty = libPart.partMovementLineItemCreateUpdateSetODataValue(pageClientAPI, 'Quantity').toString();
        if (returnQty.includes(',')) {
            returnQty = returnQty.replace(',', '.');
        }
    }
    
    return returnQty;
}
