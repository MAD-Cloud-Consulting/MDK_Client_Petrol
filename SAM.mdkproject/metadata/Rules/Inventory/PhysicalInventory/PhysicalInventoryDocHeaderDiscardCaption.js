import libCom from '../../Common/Library/CommonLibrary';

export default function PhysicalInventoryDocHeaderDiscardCaption(context) {
    if (context.binding && libCom.isCurrentReadLinkLocal(context.binding['@odata.readLink'])) {
        return context.localizeText('discard');
    }
    return ' ';
}
