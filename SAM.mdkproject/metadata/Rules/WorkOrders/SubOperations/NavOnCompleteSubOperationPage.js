import IsWONotificationVisible from '../Complete/Notification/IsWONotificationVisible';
import WorkOrderCompletionLibrary from '../Complete/WorkOrderCompletionLibrary';
import libCommon from '../../Common/Library/CommonLibrary';

export default function NavOnCompleteSubOperationPage(context, actionBinding) {
    let binding = actionBinding || libCommon.getBindingObject(context);

    WorkOrderCompletionLibrary.getInstance().setCompletionFlow('suboperation');
    WorkOrderCompletionLibrary.getInstance().initSteps(context);
    WorkOrderCompletionLibrary.getInstance().setBinding(context, binding);

    let expandOperationAction = Promise.resolve();
    if (binding && binding['@odata.type'] === '#sap_mobile.MyWorkOrderSubOperation' && (!binding.WorkOrderOperation || !binding.WorkOrderOperation.WOHeader)) {
        expandOperationAction = context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.editLink'], [], '$expand=WorkOrderOperation/WOHeader');
    }

    return expandOperationAction.then(function(result) {
        if (result && result.length > 0 && result.getItem(0).WorkOrderOperation) {
            if (binding.WorkOrderOperation) {
                binding.WorkOrderOperation.WOHeader = result.getItem(0).WorkOrderOperation.WOHeader;
            } else {
                binding.WorkOrderOperation = result.getItem(0).WorkOrderOperation;
            }
        }

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
    });
}
