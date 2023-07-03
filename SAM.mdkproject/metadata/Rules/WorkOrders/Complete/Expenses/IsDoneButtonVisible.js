import IsCompleteAction from '../IsCompleteAction';
import IsEditMode from '../../../Expense/List/IsEditMode';

export default function IsDoneButtonVisible(context) {
    return IsCompleteAction(context) ? IsEditMode(context) : true;
}
