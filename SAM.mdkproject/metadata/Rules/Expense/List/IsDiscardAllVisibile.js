import commonLib from '../../Common/Library/CommonLibrary';
import IsEditMode from './IsEditMode';

export default function IsDiscardAllVisibile(context) {
    if (IsEditMode(context)) {
        let expenses = commonLib.getStateVariable(context, 'expenses');
        
        if (expenses && expenses.length) {
            let count = 0;
            expenses.forEach(expense => {
                if (!expense.removed) {
                    count++;
                }
            });

            //Discard all needs to be displayed only in case there are more than one item.
            return count >= 2;
        }
    }

    return false;
}
