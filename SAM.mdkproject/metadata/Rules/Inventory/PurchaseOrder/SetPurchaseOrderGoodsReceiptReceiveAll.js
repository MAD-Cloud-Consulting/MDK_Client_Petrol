import libCom from '../../Common/Library/CommonLibrary';
import wrapper from '../IssueOrReceipt/ReceiptReceiveAllWrapper';

export default function SetPurchaseOrderGoodsReceiptReceiveAll(context) {
    libCom.setStateVariable(context,'IMObjectType','PO');
    libCom.setStateVariable(context, 'IMMovementType', 'R');
    return wrapper(context);
}
