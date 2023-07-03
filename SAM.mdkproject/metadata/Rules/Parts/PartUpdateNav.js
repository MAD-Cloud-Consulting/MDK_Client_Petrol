import libCom from '../Common/Library/CommonLibrary';

export default function PartUpdateNav(context) {

    let readLink = libCom.getTargetPathValue(context, '#Property:@odata.readLink');
    if (libCom.isCurrentReadLinkLocal(readLink)) {
        libCom.setOnCreateUpdateFlag(context, 'UPDATE');
        return context.executeAction('/SAPAssetManager/Actions/Parts/PartCreateUpdateNav.action');
    } else {
        return context.executeAction('/SAPAssetManager/Actions/Parts/PartUpdateNotEditableMessage.action');
    }
}
