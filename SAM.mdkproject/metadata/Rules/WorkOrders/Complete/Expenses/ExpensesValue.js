import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function ExpensesValue(context) {
    return WorkOrderCompletionLibrary.getStepValue(context, 'expenses');
}
