import libCom from '../../Common/Library/CommonLibrary';
import wrapper from '../IssueOrReceipt/IssueOrReceiptCreateUpdateNavWrapper';

export default function SetSTOGoodsReceipt(context) {
    libCom.setStateVariable(context,'IMObjectType','STO');
    libCom.setStateVariable(context, 'IMMovementType', 'R');
    return wrapper(context);
}
