import libCom from '../Common/Library/CommonLibrary';

/**
* Determine if we can edit a part
*/
export default function PartEditEnable(context) {
    let readLink = libCom.getTargetPathValue(context, '#Property:@odata.readLink');
    return libCom.isCurrentReadLinkLocal(readLink);
}
