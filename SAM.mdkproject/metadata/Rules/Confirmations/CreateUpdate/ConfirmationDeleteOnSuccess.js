/**
 * Don't close the page when coming from the Error Archive or 
 * when deleting a mileage confirmation because we're doing this directly on the list screen
 * @param {*} context 
 * @returns 
 */

import MileageActivityType from '../../ServiceOrders/Mileage/MileageActivityType';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';
import WorkOrderCompletionLibrary from '../../WorkOrders/Complete/WorkOrderCompletionLibrary';
import ExecuteActionWithAutoSync from '../../ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function ConfirmationDeleteOnSuccess(context) {
    let binding = context.binding;
    let dontClosePage = false;

    if (IsCompleteAction(context)) {
        const confimationType = WorkOrderCompletionLibrary.getConfirmationType(context); //time, mileage
        WorkOrderCompletionLibrary.updateStepState(context, confimationType, {
            data: '',
            link: '',
            value: '',
        });
        return WorkOrderCompletionLibrary.getInstance().openMainPage(context);
    }

    let fromErrorArchive = context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().FromErrorArchive; //save this here before the context changes

    dontClosePage = (MileageActivityType(context) && binding.ActivityType === MileageActivityType(context))
        || (CommonLibrary.getExpenseActivityType(context) && binding.ActivityType === CommonLibrary.getExpenseActivityType(context)) 
        || fromErrorArchive;

    return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntitySuccessMessage.action').then(() => {
        if (dontClosePage) {
            return Promise.resolve(true);
        } else {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
        }
    });
}
