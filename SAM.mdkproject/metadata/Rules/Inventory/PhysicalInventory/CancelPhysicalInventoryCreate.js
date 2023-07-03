/**
* Reaction to press of cancel button on modal, asks user for clarification,
* then calls delete function for the document
* @param {IClientAPI} context
*/
export default function CancelPhysicalInventoryCreate(context) {
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/Expense/ConfirmCloseExpensesPage.action',
        'Properties': {
            'Message': context.localizeText('confirm_cancel'),
            'OnOK': '/SAPAssetManager/Rules/Inventory/PhysicalInventory/RemovePhysicalInventoryDoc.js',
        },
    });
}
