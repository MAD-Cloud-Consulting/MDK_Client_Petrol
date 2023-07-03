import materialDocumentCreateUpdatePost from './IssueOrReceiptCreateUpdatePost';
import inboundOrOutboundUpdatePost from '../InboundOrOutbound/InboundOrOutboundUpdatePost';
import libCom from '../../Common/Library/CommonLibrary';

export default function IssueOrReceiptCreateUpdatePostWrapper(context) {

    let type = libCom.getStateVariable(context, 'IMObjectType');
    if (type === 'IB' || type === 'OB') {
        return inboundOrOutboundUpdatePost(context);
    } else {
        return materialDocumentCreateUpdatePost(context);
    }
}
