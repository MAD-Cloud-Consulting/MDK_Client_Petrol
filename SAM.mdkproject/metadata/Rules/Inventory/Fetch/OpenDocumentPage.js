import libCom from '../../Common/Library/CommonLibrary';
// import updateHeaderCountItems from '../InboundOrOutbound/UpdateHeaderCountItems';
/**
* Used to make an extension of simple close of the page
* if there are only one doc dowloaded, it make redirect to the details page
* if there is openend any modal of fetch doc - it would be closed
* @param {IClientAPI} context
*/
export default function OpenDocumentPage(context) {
    libCom.setStateVariable(context, 'DownloadIMDocsStarted', false);
    if (context.evaluateTargetPath('#Page:-Current').id === 'FetchOnlineDocumentsPage' || context.evaluateTargetPath('#Page:-Current').id === 'FetchDocumentsPage') {
        if (context.evaluateTargetPath('#Page:-Current').id === 'FetchOnlineDocumentsPage') {
            let id = context.evaluateTargetPath('#Page:-Previous').parent.id;
            if (id) {
                let parentPageName = id.split('|')[0];
                if (!parentPageName.includes('InventoryOverview')) {
                    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
                }
            }
        } else if (context.evaluateTargetPath('#Page:-Current').id === 'FetchDocumentsPage') {
            let parentPageName = context.evaluateTargetPath('#Page:-Previous').id;
            if (parentPageName !== 'InventoryOverview') {
                return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
            }
        }
        context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
            modifyDocs(context);
        });
    } else {
        modifyDocs(context);
    }
}

function modifyDocs(context) {
    let documents = context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().Documents;
    // not removing this functionality, saving it for possibility to return everything back
    // if (documents.length) {
    //     documents.forEach(async (doc) => {
    //         let type = 'EMPTY';
    //         let binding = {};
    //         switch (doc.IMObject) {
    //             case 'RS':
    //                 type = 'RES';
    //                 binding['@odata.readLink'] = `ReservationHeaders('${doc.ObjectId}')`;
    //                 break;
    //             case 'ST':
    //                 type = 'STO';
    //                 binding['@odata.readLink'] = `StockTransportOrderHeaders('${doc.ObjectId}')`;
    //                 break;
    //             case 'PO':
    //                 type = 'PO';
    //                 binding['@odata.readLink'] = `PurchaseOrderHeaders('${doc.ObjectId}')`;
    //                 break;
    //             default:
    //         }
    //         if (doc.ObjectId) {
    //             await updateHeaderCountItems(context, type, binding);
    //         }
    //     });
    // }
    if (documents.length === 1) {
        return openDoc(context, documents[0]);
    }
    return Promise.resolve(true);
}

function openDoc(context, document) {
    const autoOpenEnabled = (libCom.getAppParam(context, 'INVENTORY', 'search.auto.navigate') === 'Y');
    if (autoOpenEnabled) {
        let id = document.ObjectId;
        let order = document.OrderId;
        let type = document.IMObject;
        let query = '$filter=';
        if ((id || order) && type) {
            query = query + `(ObjectId eq '${parseInt(id, 10) || -1}' or OrderId eq '${order || -1}') and IMObject eq '${type}'`;
            return libCom.openInventoryDocDetailsPage(context, 'MyInventoryObjects', query);
        }
    }
    return Promise.resolve(true);
}
