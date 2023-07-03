import libCommon from '../../Common/Library/CommonLibrary';
import newlyCreatedDocsQuery from './NewlyCreatedDocsQuery';
/**
* Final function, before closing items list modal.
* Clears all state variables, then shows success message 
* (if 'isDeleted' param in false) and closes the page
* if count of current items in the document is 0 and not isDeleted,
* then calls warning modal and locks save of the document
* @param {IClientAPI} context
* @param {boolean} isDeleted
*/
export default function SaveCreatedDocuments(context, isDeleted = false) {
    if (isDeleted) {
        emptyStateVariables(context);
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
    } else {
        let query = newlyCreatedDocsQuery(context);
        return context.count('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocItems', query).then(count => {
            if (count) {
                emptyStateVariables(context);
                return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/DocumentCreateSuccessWithClose.action');
            } else if (isDeleted) {
                return context.executeAction({
                    'Name': '/SAPAssetManager/Actions/Expense/ConfirmCloseExpensesPage.action',
                    'Properties': {
                        'Message': context.localizeText('confirm_cancel'),
                        'OnOK': '/SAPAssetManager/Rules/Inventory/MaterialDocument/RemoveMaterialDocuments.js',
                    },
                });
            }
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/Common/GenericEndDateWarningDialog.action',
                'Properties': {
                    'Title': context.localizeText('error'),
                    'Message': context.localizeText('no_items_doc_save_issue'),
                },
            });
        });
    }
}

function emptyStateVariables(context) {
    context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().ActualDocId = '';
    context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().IsAlreadyCreatedDoc = false;
    context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().FixedData = '';
    libCommon.setStateVariable(context, 'CurrentDocsItemsMovementType', '');
    libCommon.setStateVariable(context, 'CurrentDocsItemsStorageLocation', '');
    libCommon.setStateVariable(context, 'CurrentDocsItemsPlant', '');
    libCommon.setStateVariable(context, 'CurrentDocsItemsOrderNumber', '');
}
