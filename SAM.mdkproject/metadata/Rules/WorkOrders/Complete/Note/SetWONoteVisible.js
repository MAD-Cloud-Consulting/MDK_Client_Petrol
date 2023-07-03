import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';

export default function SetWONoteVisible(context) {
    return WorkOrderCompletionLibrary.isStepVisible(context, 'note');
}
