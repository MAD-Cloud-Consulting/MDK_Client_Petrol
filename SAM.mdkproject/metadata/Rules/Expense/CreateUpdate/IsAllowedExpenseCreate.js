import ExpensesVisible from '../../ServiceOrders/Expenses/ExpensesVisible';
import MileageAddCheckIfObjectIsCompleted from '../../ServiceOrders/Mileage/MileageAddCheckIfObjectIsCompleted';

export default function IsAllowedExpenseCreate(context) {

    if (ExpensesVisible(context)) {
        return MileageAddCheckIfObjectIsCompleted(context);
    } else {
        return Promise.resolve(false);
    }
}
