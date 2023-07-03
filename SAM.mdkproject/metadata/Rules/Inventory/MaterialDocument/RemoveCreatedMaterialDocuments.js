import docDelete from '../../Inventory/MaterialDocument/MaterialDocumentDelete';
import EnableInventoryClerk from '../../SideDrawer/EnableInventoryClerk';
/**
* Getting id of lat created document, getting all its data and calling delete function
* @param {IClientAPI} context
*/
export default function RemoveCreatedMaterialDocuments(context, callConfirmation = true) {
    let isIM = EnableInventoryClerk(context);
    let docId = isIM && context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().ActualDocId;
    let filter = '';
    if (docId) {
        filter = docId;
    } else if (context.binding) {
        filter = context.binding.MaterialDocNumber;
    }

    let query = `$filter=MaterialDocNumber eq '${filter}'`;
    if (callConfirmation) {
        return context.executeAction('/SAPAssetManager/Actions/DiscardWarningMessage.action').then(successResult => {
            if (successResult.data) {
                return deleteDocuments(context, docId, query);
            }
            return true;
        });
    }
    return deleteDocuments(context, docId, query);
}

function deleteDocuments(context, docId, query) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocuments', [], query).then((data) => {
        if (data && data.length === 1) {
            let binding = data.getItem(0);
            if (docId) {
                context.setActionBinding(binding);
            } else {
                context.getPageProxy().setActionBinding(binding);
            }
            
            return docDelete(context, binding);
        }
        return true;
    });
}
