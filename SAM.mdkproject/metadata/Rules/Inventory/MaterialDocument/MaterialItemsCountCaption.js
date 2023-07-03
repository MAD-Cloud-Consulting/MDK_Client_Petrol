import comLib from '../../Common/Library/CommonLibrary';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function MaterialItemsCountCaption(clientAPI) {
    const queryOptions = "$filter=(MaterialDocNumber eq '" + clientAPI.getPageProxy().binding.MaterialDocNumber + "')";
    return comLib.getEntitySetCount(clientAPI, 'MaterialDocItems', queryOptions).then(total => {
        const count = clientAPI.evaluateTargetPath('#Count');
        if (total !== count) {
            return clientAPI.localizeText('material_document_items_title') + ' (' + count + '/' + total + ')';
        } else {
            return clientAPI.localizeText('material_document_items_title') + ' (' + count + ')';
        }
    });
}
