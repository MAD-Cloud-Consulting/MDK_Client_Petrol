import libCom from '../../Common/Library/CommonLibrary';

export default function GetOrderedQuantityCaption(context) {

    let type = libCom.getStateVariable(context, 'IMObjectType');
    let move = libCom.getStateVariable(context, 'IMMovementType');

    if (type === 'PO' || (type === 'PRD' && move === 'R')) {
        return '$(L,po_item_detail_confirmed)';
    } else if (type === 'STO') {
        if (move === 'R') { //Receipt
            return '$(L,po_item_detail_confirmed)';
        }
        return '$(L,reservation_item_withdrawn_qty)'; //Issue
    } else if (type === 'RES' || (type === 'PRD' && move === 'I')) {
        return '$(L,reservation_item_withdrawn_qty)';
    }

    if (type === 'ADHOC' && (move === 'I' || move === 'T')) {
        return '$(L,reservation_item_withdrawn_qty)';
    }
    
    return '$(L,po_item_detail_confirmed)';
}
