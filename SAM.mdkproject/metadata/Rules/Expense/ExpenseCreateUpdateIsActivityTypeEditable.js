import ValidationLibrary from '../Common/Library/ValidationLibrary';
import ExpenseCreateUpdateInitialWorkCenter from './ExpenseCreateUpdateInitialWorkCenter';

export default function ExpenseCreateUpdateIsActivityTypeEditable(clientAPI) {
    return ExpenseCreateUpdateInitialWorkCenter(clientAPI).then(workCenter => {
        return !ValidationLibrary.evalIsEmpty(workCenter);
    });
}
