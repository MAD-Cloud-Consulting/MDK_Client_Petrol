export default function checklistDiscard(context) {
    return context.executeAction('/SAPAssetManager/Actions/Checklists/ChecklistDiscardConfirm.action').then(successResult => {
        if (successResult.data === true) {
            return context.executeAction('/SAPAssetManager/Actions/Checklists/ChecklistDelete.action');
        }
        return Promise.resolve(true);
    });
}
