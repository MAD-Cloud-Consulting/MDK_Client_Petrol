import libCom from '../../Common/Library/CommonLibrary';

export default function MaterialHeaderButtonVisible(context, ignoreMDoc = false) {
    const isMDocItem = context.binding['@odata.type'].includes('MaterialDocItem');
    const isFromMdoc = libCom.getStateVariable(context, 'BlockIMNavToMDocHeader');
    return isMDocItem && (ignoreMDoc || !isFromMdoc);
}
