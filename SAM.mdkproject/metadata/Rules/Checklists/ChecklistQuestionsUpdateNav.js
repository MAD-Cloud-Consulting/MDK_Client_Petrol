export default function ChecklistQuestioinsUpdateNav(context) {

    let lock = context.getClientData().isProcessing;

    if (!lock) {
        context.getClientData().isProcessing = true;
        let extension = context.getControl('FormCellContainer')._control;
        extension.executeChangeSet('/SAPAssetManager/Actions/Checklists/AnswerUpdateChangeSet.action').then(function() {
            context.getClientData().isProcessing = false;
        });
    }
}
