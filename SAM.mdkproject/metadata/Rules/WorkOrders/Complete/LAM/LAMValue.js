import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function LAMValue(context) {
    return WorkOrderCompletionLibrary.getStepValue(context, 'lam');
}
