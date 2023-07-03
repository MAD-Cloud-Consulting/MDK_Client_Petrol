import PhysicalInventoryDocumentID from './PhysicalInventoryDocumentID';
import PhysicalInventoryDocumentFiscalYear from './PhysicalInventoryDocumentFiscalYear';
/**
* Return count of items, that are available for document
* @param {IClientAPI} context
*/
export default function PhysicalInventoryDocumentItemsCountCaption(context) {
    let documentID = PhysicalInventoryDocumentID(context);
    let fiscalYear = PhysicalInventoryDocumentFiscalYear(context);
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'PhysicalInventoryDocHeaders', [], "$filter=PhysInvDoc eq '" + documentID + "' and FiscalYear eq '" + fiscalYear + "'&$expand=PhysicalInventoryDocItem_Nav").then(result => {
        if (result) {
            return context.localizeText('items_list_count', result.getItem(0).PhysicalInventoryDocItem.length);
        }
        return context.localizeText('items_list_count', 0);
    });
}

