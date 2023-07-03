/**
 * Reload the current header object's status and redraw the header section to refresh the status on screen
 * @param {*} context 
 * @returns 
 */
export default function RedrawDetailsHeader(context) {
    if (context.binding) {
        const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
        let filter,field;
        let process = false;

        if (type === 'ReservationHeader') {
            filter = '$select=DocumentStatus';
            field = 'DocumentStatus';
            process = true;
        } else if (type === 'PurchaseOrderHeader') {
            filter = '$select=DocumentStatus';
            field = 'DocumentStatus';
            process = true;
        } else if (type === 'StockTransportOrderHeader') {
            filter = '$select=DocumentStatus';
            field = 'DocumentStatus';
            process = true;
        } else if (type === 'InboundDelivery') {
            filter = '$select=GoodsMvtStatus';
            field = 'GoodsMvtStatus';
            process = true;
        } else if (type === 'OutboundDelivery') {
            filter = '$select=GoodsMvtStatus';
            field = 'GoodsMvtStatus';
            process = true;
        }
        if (process) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], filter).then(results => {
                if (results && results.length > 0) {
                    context.binding[field] = results.getItem(0)[field];
                }
                try {                    
                    context.getControl('SectionedTable').getSection('SectionObjectHeader').redraw(true);
                } catch (err) {
                    return false;
                }
                return true;
            });
        }
    }
    return Promise.resolve(true);
}
