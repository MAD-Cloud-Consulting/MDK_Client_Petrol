import libCom from '../../Common/Library/CommonLibrary';
import wrapper from '../IssueOrReceipt/IssueOrReceiptCreateUpdateNavWrapper';

export default function SetSTOIssue(context) {
    libCom.setStateVariable(context,'IMObjectType','STO');
    libCom.setStateVariable(context, 'IMMovementType', 'I');
    return wrapper(context);
}
