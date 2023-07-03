import comLib from '../../Common/Library/CommonLibrary';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function MaterialDocumentListCaption(clientAPI) {
    const page = clientAPI.evaluateTargetPath('#Page:' + comLib.getPageName(clientAPI));
    const total = page.context.clientData['MaterialDocItems.total'];
    const count = clientAPI.evaluateTargetPath('#Count');
    if (total !== count) {
        return clientAPI.localizeText('material_document_items_title') + ' (' + count + '/' + total + ')';
    } else {
        return clientAPI.localizeText('material_document_items_title') + ' (' + count + ')';
    }
}
