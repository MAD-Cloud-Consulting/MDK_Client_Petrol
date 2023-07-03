import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function ChangeNotification(context) {
    if (!WorkOrderCompletionLibrary.getStepDataLink(context, 'notification')) {
        return Promise.resolve();
    }

    context.getPageProxy().setActionBinding(WorkOrderCompletionLibrary.getStepData(context, 'notification'));
    return context.getPageProxy().executeAction('/SAPAssetManager/Actions/Notifications/NotificationUpdateMalfunctionEndNav.action');
}
