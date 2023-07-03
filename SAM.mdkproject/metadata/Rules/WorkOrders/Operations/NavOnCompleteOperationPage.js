import IsWONotificationVisible from '../Complete/Notification/IsWONotificationVisible';
import WorkOrderCompletionLibrary from '../Complete/WorkOrderCompletionLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import {ChecklistLibrary as libChecklist} from '../../Checklists/ChecklistLibrary';

export default function NavOnCompleteOperationPage(context, actionBinding) {
    let binding = actionBinding || libCommon.getBindingObject(context);

    const equipment = binding.OperationEquipment;
    const functionalLocation = binding.OperationFunctionLocation;

    let expandOperationAction = Promise.resolve();
    if (binding && binding['@odata.type'] === '#sap_mobile.MyWorkOrderOperation' && !binding.WOHeader) {
        expandOperationAction = context.read('/SAPAssetManager/Services/AssetManager.service', binding['@odata.editLink'], [], '$expand=WOHeader');
    }

    return expandOperationAction.then(function(result) {
        if (result && result.length > 0) {
            binding.WOHeader = result.getItem(0).WOHeader;
        }
        //Check for non-complete checklists and ask for confirmation    
        return libChecklist.allowWorkOrderComplete(context, equipment, functionalLocation).then(results => {
            if (results === true) {
                WorkOrderCompletionLibrary.getInstance().setCompletionFlow('operation');
                WorkOrderCompletionLibrary.getInstance().initSteps(context);
                WorkOrderCompletionLibrary.getInstance().setBinding(context, binding);

                return IsWONotificationVisible(context, binding.WOHeader, 'Notification').then((notification) => {
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
            return Promise.resolve();
        });
    });
}
