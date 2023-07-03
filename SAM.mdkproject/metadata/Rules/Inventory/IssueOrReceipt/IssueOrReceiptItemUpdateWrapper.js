import libCom from '../../Common/Library/CommonLibrary';

export default function IssueOrReceiptItemUpdateWrapper(context) {

    //Update the inventory item if necessary
    let type = libCom.getStateVariable(context, 'IMObjectType');
    if (type === 'PO' || type === 'STO') {
        return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptPurchaseOrderItemUpdate.action');  
    } else if (type === 'RES') {
        return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/IssueOrReceiptReservationItemUpdate.action'); 
    }
    return Promise.resolve(true); //No update necessary
}
