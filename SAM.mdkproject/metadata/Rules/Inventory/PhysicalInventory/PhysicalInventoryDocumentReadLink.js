import PhysicalInventoryDocumentID from './PhysicalInventoryDocumentID';
import PhysicalInventoryDocumentFiscalYear from './PhysicalInventoryDocumentFiscalYear';

export default function PhysicalInventoryDocumentReadLink(context, onDelete) {
    let documentID = PhysicalInventoryDocumentID(context);
    let fiscalYear = PhysicalInventoryDocumentFiscalYear(context);
    let expand = '';

    if (context.binding  && !onDelete) {
        let type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'PhysicalInventoryDocHeader') {
            return context.binding['@odata.readLink']; //We are adding an item to a local PI header
        }
    }
    if (onDelete) {
        expand = '&$expand=MyInventoryObject_Nav';
    }
    return context.read(
        '/SAPAssetManager/Services/AssetManager.service',
        'PhysicalInventoryDocHeaders',
        [],
        "$filter=PhysInvDoc eq '" + documentID + "' and FiscalYear eq '" + fiscalYear + "'" + expand).then(result => {
            if (result && result.length > 0) {
                // Grab the first row (should only ever be one row)
                let row = result.getItem(0);
                if (onDelete) { //Return the header and parent links on delete
                    if (row.MyInventoryObject_Nav) {
                        return [row['@odata.readLink'], row.MyInventoryObject_Nav[['@odata.readLink']]];
                    }
                    return [row['@odata.readLink'], ''];
                }
                return row['@odata.readLink'];
            }
            return '';
    });
}
