import libCom from '../../Common/Library/CommonLibrary';

export default function PhysicalInventoryReadLinkIsLocal(context) {
    return libCom.isCurrentReadLinkLocal(context.binding['@odata.readLink']);  //Was this header or line item created locally on client?
}
