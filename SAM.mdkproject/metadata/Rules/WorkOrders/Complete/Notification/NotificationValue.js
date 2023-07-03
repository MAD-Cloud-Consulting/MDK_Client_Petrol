import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function NotificationValue(context) {
    return WorkOrderCompletionLibrary.getStepValue(context, 'notification');
}
