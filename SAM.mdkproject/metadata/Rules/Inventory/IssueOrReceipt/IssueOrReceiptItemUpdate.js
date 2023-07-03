import libCom from '../../Common/Library/CommonLibrary';

/**
 * 
 * Update the inventory item object quantities after mat doc item add/edit
 */
export default function IssueOrReceiptItemUpdate(context) {
    let type = libCom.getStateVariable(context, 'IMObjectType');
    let move = libCom.getStateVariable(context, 'IMMovementType');
    
    if (type === 'PO') {
        return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptPurchaseOrderItemUpdate.action');
    } else if (type === 'STO') {
        return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptSTOItemUpdate.action');
    } else if (type === 'RES' || (type === 'PRD' && move === 'I')) {
        return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptReservationItemUpdate.action');
    } else if (type === 'PRD' && move === 'R') {
        return context.executeAction('/SAPAssetManager/Actions/Inventory/ProductionOrder/ProductionOrderItemUpdate.action');
    }
    return Promise.resolve(true);
}
