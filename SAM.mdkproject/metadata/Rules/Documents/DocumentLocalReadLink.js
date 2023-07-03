import libCom from '../Common/Library/CommonLibrary';

export default function DocumentLocalReadLink(context) {
    let newCounter = context.getClientData().readLinkCounter;
    let docReadLink = libCom.getTargetPathValue(context, '#ClientData/#Property:mediaReadLinks/#index:' + newCounter);
    context.getClientData().readLinkCounter = newCounter + 1;
    return docReadLink;
}
