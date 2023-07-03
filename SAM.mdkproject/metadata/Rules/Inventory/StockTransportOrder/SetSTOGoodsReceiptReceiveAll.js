import libCom from '../../Common/Library/CommonLibrary';
import wrapper from '../IssueOrReceipt/ReceiptReceiveAllWrapper';

export default function SetSTOGoodsReceiptReceiveAll(context) {
    libCom.setStateVariable(context,'IMObjectType','STO');
    libCom.setStateVariable(context, 'IMMovementType', 'R');
    return wrapper(context);
}
