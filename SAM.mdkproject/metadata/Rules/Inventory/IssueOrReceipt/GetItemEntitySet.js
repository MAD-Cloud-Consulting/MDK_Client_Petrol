import libCom from '../../Common/Library/CommonLibrary';

/**
 * 
 * Return the correct entity set for receipt items
 */
export default function GetItemEntitySet(context) {
    let type = libCom.getStateVariable(context, 'IMObjectType');
    let move = libCom.getStateVariable(context, 'IMMovementType');
    if (type === 'PO') {
        return 'PurchaseOrderItems';
    } else if (type === 'STO') {
        return 'StockTransportOrderItems';
    } else if (type === 'RES') {
        return 'ReservationItems';
    } else if (type === 'PRD' && move === 'R') {
        return 'ProductionOrderItems';
    } else if (type === 'PRD' && move === 'I') {
        return 'ProductionOrderComponents';
    }
}
