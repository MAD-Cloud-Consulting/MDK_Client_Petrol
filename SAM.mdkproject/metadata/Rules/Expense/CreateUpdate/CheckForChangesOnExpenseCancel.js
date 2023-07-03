import CheckForChangesBeforeClose from '../../Common/CheckForChangesBeforeClose';
import common from '../../Common/Library/CommonLibrary';
import mileageAddNav from '../../ServiceOrders/Mileage/MileageAddNav';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function CheckForChangesOnExpenseCancel(context) { 
    return CheckForChangesBeforeClose(context).then(() => {
        if (common.getStateVariable(context, 'IsExecuteMilage')) {
            common.setStateVariable(context, 'WOBinding', context.binding);
            return mileageAddNav(context).then(() => {
                common.setStateVariable(context, 'IsExecuteMilage', false);
                return Promise.resolve();
            });
        }
        return Promise.resolve();
    });
}
