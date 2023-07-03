import libCom from '../../Common/Library/CommonLibrary';
import WorkOrderCompletionLibrary from './WorkOrderCompletionLibrary';

export default function ResetButtonVisible(context) {
    let expenses = libCom.getStateVariable(context, 'expenses');

    let isValuesExist = (expenses && expenses.length > 0) || WorkOrderCompletionLibrary.getStepValue(context, 'mileage') ||
        WorkOrderCompletionLibrary.getStepValue(context, 'notification') || WorkOrderCompletionLibrary.getStepValue(context, 'lam') ||
        WorkOrderCompletionLibrary.getStepValue(context, 'time') || WorkOrderCompletionLibrary.getStepValue(context, 'note') ||
        WorkOrderCompletionLibrary.getStepValue(context, 'signature') || WorkOrderCompletionLibrary.getStepValue(context, 'digit_signature');

    return isValuesExist;
}
