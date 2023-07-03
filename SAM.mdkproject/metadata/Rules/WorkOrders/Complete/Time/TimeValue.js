import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function TimeValue(context) {
    return WorkOrderCompletionLibrary.getStepValue(context, 'time');
}
