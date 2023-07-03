import IsCompleteAction from '../IsCompleteAction';
import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function GetIsFinal(context) {
    if (IsCompleteAction(context)) {
        let timeData = WorkOrderCompletionLibrary.getStepData(context, 'time');
        if (timeData && timeData.FinalConfirmation) {
           return 'X';
        }
    }

    return '';
}
