import libCom from '../../Common/Library/CommonLibrary';

export default function GetIssueOrReceiptCaption(context) {

    //Get the screen caption for receipt or issue create/edit
    const movemnetType = libCom.getStateVariable(context, 'IMMovementType');
    const type = context.binding && context.binding['@odata.type'].substring('#sap_mobile.'.length);
    const objectType = libCom.getStateVariable(context, 'IMObjectType');
    const isShowItemNum = type === 'PurchaseOrderItem' || type === 'StockTransportOrderItem' || type === 'ReservationItem' || type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem';
    let result = '';

    if (movemnetType === 'R') {
        if (objectType === 'IB' || objectType === 'OB') {
            result = '$(L,delivery_item_title)';
        } else if (objectType === 'ADHOC') {
            result = '$(L, add_goods_receipt)';
        }
        result = '$(L,po_item_receiving_title)';
    } else if (movemnetType === 'I') {
        if (objectType === 'TRF') {
            result = '$(L,stock_transfer)';
        } else if (objectType === 'IB' || objectType === 'OB') {
            result = '$(L,delivery_item_title)';
        } else if (objectType === 'ADHOC') {
            result = '$(L, add_goods_issue)';
        } else if (objectType === 'PRD') {
            result = '$(L, issue_component)';
        } else {
            result = '$(L,issue_item)';
        }
    } else if (movemnetType === 'T') {
        if (objectType === 'ADHOC') {
            result = '$(L,stock_transfer)';
        }
    } else if (objectType === 'REV') {
        result = '$(L,item_reversing_title)';
    }

    if (result && isShowItemNum) {
        const item = context.binding.ItemNum || context.binding.Item;
        result += ' - ' + item;
    }

    return result;
}
