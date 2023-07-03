import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function SetWONotificationVisible(context) {
    return WorkOrderCompletionLibrary.isStepVisible(context, 'notification');
}
