import libCom from '../../Common/Library/CommonLibrary';

export default function EnableMaterialDocumentEditable(context) {
    return libCom.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
}


