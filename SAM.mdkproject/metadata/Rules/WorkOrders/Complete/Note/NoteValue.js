import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function NoteValue(context) {
    return WorkOrderCompletionLibrary.getStepValue(context, 'note');
}
