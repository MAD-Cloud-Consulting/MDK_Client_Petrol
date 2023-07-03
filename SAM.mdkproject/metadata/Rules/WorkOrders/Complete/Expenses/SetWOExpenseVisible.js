import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function SetWOExpenseVisible(context) {
    return WorkOrderCompletionLibrary.isStepVisible(context, 'expenses');
}
