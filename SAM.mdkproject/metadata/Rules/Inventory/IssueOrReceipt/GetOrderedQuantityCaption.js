import libCom from '../../Common/Library/CommonLibrary';

export default function GetOrderedQuantityCaption(context) {

    let type = libCom.getStateVariable(context, 'IMObjectType');
    let move = libCom.getStateVariable(context, 'IMMovementType');

    if (type === 'PO' || type === 'STO' || (type === 'PRD' && move === 'R') || type === 'REV') {
        return '$(L,po_item_detail_requested)';
    } else if (type === 'RES' || (type === 'PRD' && move === 'I')) {
        return '$(L,reservation_item_requirement_qty)';
    } else if (type === 'IB' || type === 'OB') {
        return '$(L, delivery_quatity)';
    } else {
        return '';
    }
}
