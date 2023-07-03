import IsWONotificationVisible from './Complete/Notification/IsWONotificationVisible';
import WorkOrderCompletionLibrary from './Complete/WorkOrderCompletionLibrary';
import libCommon from '../Common/Library/CommonLibrary';

export default function NavOnCompleteWorkOrderPage(context, actionBinding) {
    let binding = actionBinding || libCommon.getBindingObject(context);
  
    WorkOrderCompletionLibrary.getInstance().setCompletionFlow('');
    WorkOrderCompletionLibrary.getInstance().initSteps(context);
    binding.pageBinding = ''; //Reset meter binding to avoid serialization error
    WorkOrderCompletionLibrary.getInstance().setBinding(context, binding);

    return IsWONotificationVisible(context, binding, 'Notification').then((notification) => {
        if (notification) {
            WorkOrderCompletionLibrary.updateStepState(context, 'notification', {
                visible: true,
                data: JSON.stringify(notification),
                link: notification['@odata.editLink'],
                initialData: JSON.stringify(notification),
            });
        } else {
            WorkOrderCompletionLibrary.updateStepState(context, 'notification', {
                visible: false,
            });
        }

        WorkOrderCompletionLibrary.getInstance().setCompleteFlag(context, true);
        return WorkOrderCompletionLibrary.getInstance().openMainPage(context, false);
    });
}
