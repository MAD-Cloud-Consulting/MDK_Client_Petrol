import libCommon from '../../Common/Library/CommonLibrary';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';

export default function IsCancelExpenseButtonVisible(context) {
    if (IsCompleteAction(context)) {
        return false;
    }

    let reopened = libCommon.getStateVariable(context, 'ExpenseScreenReopened');
    if (reopened) {
        libCommon.setStateVariable(context, 'ExpenseScreenReopened', false);
        return true;
    }

    return false;
}
