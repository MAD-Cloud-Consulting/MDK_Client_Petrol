import libCom from '../../Common/Library/CommonLibrary';

export default function PhysicalInventoryDocHeaderAddItemCaption(context) {
    if (context.binding && libCom.isCurrentReadLinkLocal(context.binding['@odata.readLink'])) {
        return context.localizeText('add_another_item');
    }
    return ' ';
}
