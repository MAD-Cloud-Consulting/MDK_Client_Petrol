import doc from './PhysicalInventoryDocumentID';
import year from './PhysicalInventoryDocumentFiscalYear';
import item from './PhysicalInventoryDocumentItemID';

/**
 * Get the query options for the item number we just added
 * @param {*} context 
 * @returns 
 */
export default function GetItemQueryOptionsOnCreateForSerialAdd(context) {

    let document = doc(context);
    let fiscal = year(context);
    let itemNum = item(context);

    return "$filter=Item eq '" + itemNum + "' and PhysInvDoc eq '" + document + "' and FiscalYear eq '" + fiscal + "'";
}

