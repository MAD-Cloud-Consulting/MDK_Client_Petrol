
import libCom from '../../Common/Library/CommonLibrary';

export default function IssueOrReceiptIsAllowed(context) {

    let type = libCom.getStateVariable(context, 'IMMovementType');
    let object = libCom.getStateVariable(context, 'IMObjectType');

    let binding = context.getPageProxy().getActionBinding();
    let open;
    let deliveryCompleteFlag;
    let finalDeliveryFlag = '';

    libCom.removeStateVariable(context, 'StockTransportOrderExplainMsg');

    if (type === 'R') {  //Receipts 
        if (object === 'PO') {
            open = Number(binding.OpenQuantity);
            deliveryCompleteFlag = binding.DeliveryCompletedFlag;
            finalDeliveryFlag = binding.FinalDeliveryFlag;
        } else if (object === 'PRD') {
            open = Number(binding.OrderQuantity) - Number(binding.ReceivedQuantity);
            deliveryCompleteFlag = binding.DeliveryCompletedFlag;
        } else if (object === 'STO') {
            open = Number(binding.IssuedQuantity) - Number(binding.ReceivedQuantity);
            deliveryCompleteFlag = binding.DeliveryCompletedFlag;
            finalDeliveryFlag = binding.FinalDeliveryFlag;
            if (Number(binding.IssuedQuantity) === 0) { //Cannot receive if the line has not yet been issued
                libCom.setStateVariable(context, 'StockTransportOrderExplainMsg', true);
                return false;
            }
        }
    } else if (type === 'I') { //Issues
        if (object === 'RES' || object === 'PRD') {
            open = Number(binding.RequirementQuantity) - Number(binding.WithdrawalQuantity);
            deliveryCompleteFlag = binding.Completed;
        } else if (object === 'STO') {
            open = Number(binding.OrderQuantity) - Number(binding.IssuedQuantity);
            deliveryCompleteFlag = binding.DeliveryCompletedFlag;
            finalDeliveryFlag = binding.FinalDeliveryFlag;
        }
    }

    //If no open quantity or delivery completed flag is set, don't allow further goods movement on this line item
    if (open <= 0 || deliveryCompleteFlag === 'X' || finalDeliveryFlag === 'X') {
        return false;
    }
    return true;
}
